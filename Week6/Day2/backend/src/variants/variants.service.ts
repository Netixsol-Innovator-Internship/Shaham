import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Variant } from './schemas/variants.schema';
import { Model, Types } from 'mongoose';
import { ProductsService } from '../products/products.service';

@Injectable()
export class VariantsService {
  constructor(@InjectModel(Variant.name) private variantModel: Model<Variant>, private products: ProductsService) {}

  async create(productId: string, data: any) {
    // ensure product exists
    const product = await this.products.findById(productId).catch(()=>null);
    if (!product) throw new NotFoundException('Product not found');

    const v = await this.variantModel.create({ ...data, productId: new Types.ObjectId(productId) });
    return v;
  }

  async update(id: string, data: any) {
    return this.variantModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.variantModel.findByIdAndDelete(id);
  }

  async findById(id: string) {
    const v = await this.variantModel.findById(id).lean();
    if (!v) throw new NotFoundException('Variant not found');
    return v;
  }

  async listByProduct(productId: string) {
    return this.variantModel.find({ productId }).lean();
  }

  /**
   * Aggregation helper: find variants matching filters (color, price range)
   */
  async findMatching(productIds: string[], filters: { color?: string; minPrice?: number; maxPrice?: number }) {
    const match: any = {};
    if (productIds && productIds.length) match.productId = { $in: productIds.map((id) => new Types.ObjectId(id)) };
    if (filters.color) match.color = filters.color;
    if (filters.minPrice != null || filters.maxPrice != null) {
      match.$and = [];
      if (filters.minPrice != null) match.$and.push({ regularPrice: { $gte: filters.minPrice } });
      if (filters.maxPrice != null) match.$and.push({ regularPrice: { $lte: filters.maxPrice } });
    }

    return this.variantModel.find(match).lean();
  }
}
