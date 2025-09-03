import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Variant, VariantDocument } from '../variants/schemas/variants.schema';
import { SizeStock, SizeStockDocument } from '../sizestocks/schemas/sizestocks.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Variant.name) private variantModel: Model<VariantDocument>,
    @InjectModel(SizeStock.name) private sizeStockModel: Model<SizeStockDocument>,
  ) {}

  async list(filters: any = {}) {
    const query: any = { isActive: true };

    if (filters.category) query.category = filters.category;
    if (filters.style) query.style = filters.style;

    const products = await this.productModel.find(query).lean();

    const results = [];
    for (const product of products) {
      const variants = await this.variantModel.find({ productId: product._id }).lean();
      for (const variant of variants) {
        const sizes = await this.sizeStockModel.find({ variantId: variant._id }).lean();
        (variant as any).sizes = sizes;
      }
      (product as any).variants = variants;
      results.push(product);
    }

    return results;
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id).lean();
    if (!product) throw new NotFoundException('Product not found');

    const variants = await this.variantModel.find({ productId: product._id }).lean();
    for (const variant of variants) {
      const sizes = await this.sizeStockModel.find({ variantId: variant._id }).lean();
      (variant as any).sizes = sizes;
    }
    (product as any).variants = variants;

    return product;
  }

  async createProduct(data: any) {
    return this.productModel.create(data);
  }

  async updateProduct(id: string, data: any) {
    return this.productModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id: string) {
    return this.productModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async incrementSoldCount(id: string, qty = 1) {
    return this.productModel.findByIdAndUpdate(
      id,
      { $inc: { sold: qty } },
      { new: true },
    );
  }
}
