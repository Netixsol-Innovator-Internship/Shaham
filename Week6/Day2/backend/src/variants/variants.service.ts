import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Variant } from './schemas/variants.schema';
import { Model, Types } from 'mongoose';
import { ProductsService } from '../products/products.service';
import { SizeStock, SizeStockDocument } from '../sizestocks/schemas/sizestocks.schema';

@Injectable()
export class VariantsService {
  constructor(
    @InjectModel(Variant.name) private variantModel: Model<Variant>,
    private products: ProductsService,
    @InjectModel(SizeStock.name) private sizeStockModel: Model<SizeStockDocument>,
  ) {}

  // --- helper: normalize incoming size strings to canonical enum values ---
  private normalizeSizeValue(raw?: string): string | null {
    if (!raw) return null;
    const s = String(raw).trim().toLowerCase();
    // remove spaces, dots, underscores, and normalize hyphens
    const cleaned = s.replace(/[\s\._]/g, '').replace(/–/g, '-');

    const map: Record<string, string> = {
      // short codes
      'xxs': 'xx-small',
      'xs': 'x-small',
      's': 'small',
      'm': 'medium',
      'l': 'large',
      'xl': 'x-large',
      'xxl': 'xx-large',
      '3xl': '3x-large',
      '4xl': '4x-large',

      // common full-word inputs
      'xx-small': 'xx-small',
      'x-small': 'x-small',
      'xsmall': 'x-small',
      'small': 'small',
      'medium': 'medium',
      'large': 'large',
      'x-large': 'x-large',
      'xlarge': 'x-large',
      'xx-large': 'xx-large',
      'xxlarge': 'xx-large',
      '3x-large': '3x-large',
      '3xlarge': '3x-large',
      '4x-large': '4x-large',
      '4xlarge': '4x-large',
    };

    return map[cleaned] || null;
  }

  // --- create a variant and persist provided sizeStocks (if any) ---
  async create(productId: string, data: any) {
    console.log('VariantsService.create called with:', { productId, data });
    
    const product = await this.products.findById(productId).catch(() => null);
    if (!product) throw new NotFoundException('Product not found');

    console.log('Found product for variant creation:', product.name);

    const v = await this.variantModel.create({ ...data, productId: new Types.ObjectId(productId) });
    console.log('Created variant:', v);

    if (data.sizeStocks?.length) {
      console.log('Creating size stocks:', data.sizeStocks);
      const docs: any[] = data.sizeStocks.map((s: any) => {
        const normalized = this.normalizeSizeValue(s.size);
        if (!normalized) {
          throw new BadRequestException(
            `Invalid size value: "${s.size}". Examples of valid values: S, M, L, XL, small, medium, x-large`,
          );
        }
        return {
          variantId: v._id,
          size: normalized,
          stock: s.stock ?? 0,
        };
      });
      console.log('Size stock docs to insert:', docs);
      const insertedSizeStocks = await this.sizeStockModel.insertMany(docs);
      console.log('Inserted size stocks:', insertedSizeStocks);
    }

    // attach sizes for response
    const sizes = await this.sizeStockModel.find({ variantId: v._id }).lean();
    const variantObj: any = v.toObject ? v.toObject() : { ...v };
    variantObj.sizes = sizes;
    variantObj.sizeStocks = sizes; // Add sizeStocks alias for frontend compatibility

    console.log('VariantsService.create final result:', variantObj);
    return variantObj;
  }

  // --- update existing variant; if sizeStocks provided, replace them ---
  async update(id: string, data: any) {
    console.log('VariantsService.update called with:', { id, data });
    
    const variantDoc = await this.variantModel.findById(id);
    if (!variantDoc) throw new NotFoundException('Variant not found');

    console.log('Found variant:', variantDoc);

    for (const [key, val] of Object.entries(data)) {
      if (key === 'sizeStocks') continue;
      (variantDoc as any)[key] = val;
    }
    const savedVariant = await variantDoc.save();
    console.log('Saved variant:', savedVariant);

    if (data.sizeStocks) {
      await this.sizeStockModel.deleteMany({ variantId: variantDoc._id });

      if (Array.isArray(data.sizeStocks) && data.sizeStocks.length) {
        const docs = data.sizeStocks.map((s: any) => {
          const normalized = this.normalizeSizeValue(s.size);
          if (!normalized) {
            throw new BadRequestException(
              `Invalid size value: "${s.size}". Examples of valid values: S, M, L, XL, small, medium, x-large`,
            );
          }
          return {
            variantId: variantDoc._id,
            size: normalized,
            stock: s.stock ?? 0,
          };
        });
        await this.sizeStockModel.insertMany(docs);
      }
    }

    const sizes = await this.sizeStockModel.find({ variantId: variantDoc._id }).lean();
    const variantObj: any = variantDoc.toObject ? variantDoc.toObject() : { ...variantDoc };
    variantObj.sizes = sizes;
    variantObj.sizeStocks = sizes; // Add sizeStocks alias for frontend compatibility

    console.log('VariantsService.update final result:', variantObj);
    return variantObj;
  }

  async findById(id: string) {
    return this.variantModel.findById(id).lean();
  }

  async listByProduct(productId: string) {
    return this.variantModel.find({ productId }).lean();
  }

  async findMatching(productIds: string[], filters: { color?: string; minPrice?: number; maxPrice?: number }) {
    const match: any = {};
    if (productIds?.length) match.productId = { $in: productIds.map((id) => new Types.ObjectId(id)) };
    if (filters.color) match.color = filters.color;
    if (filters.minPrice != null || filters.maxPrice != null) {
      match.$and = [];
      if (filters.minPrice != null) match.$and.push({ regularPrice: { $gte: filters.minPrice } });
      if (filters.maxPrice != null) match.$and.push({ regularPrice: { $lte: filters.maxPrice } });
    }

    return this.variantModel.find(match).lean();
  }

  async delete(id: string) {
    const variant = await this.variantModel.findById(id).lean();
    if (!variant) throw new NotFoundException('Variant not found');

    await this.sizeStockModel.deleteMany({ variantId: variant._id });
    return this.variantModel.findByIdAndDelete(id).lean();
  }
}
