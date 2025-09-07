import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Variant, VariantDocument } from '../variants/schemas/variants.schema';
import { SizeStock, SizeStockDocument } from '../sizestocks/schemas/sizestocks.schema';
import { Model, Types } from 'mongoose';

// Product with populated variants and sizes
export interface PopulatedProduct extends Omit<Product, 'variants'> {
  variants: Array<Variant & { sizes: SizeStock[] }>;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Variant.name) private variantModel: Model<VariantDocument>,
    @InjectModel(SizeStock.name) private sizeStockModel: Model<SizeStockDocument>,
  ) { }

  // --- helper: attach variants with sizes ---
  private async populateVariants(product: any): Promise<PopulatedProduct> {
    const variants = await this.variantModel.find({ productId: product._id }).lean();
    const populatedVariants = [];

    for (const variant of variants) {
      const sizes = await this.sizeStockModel.find({ variantId: variant._id }).lean();
      populatedVariants.push({
        ...variant,
        sizes,
      });
    }

    return {
      ...product,
      variants: populatedVariants,
    } as PopulatedProduct;
  }

  // --- product listing with filters ---
  async list(filters: any = {}): Promise<PopulatedProduct[]> {
    const query: any = { isActive: true };

    if (filters.category) query.category = filters.category;
    if (filters.style) query.style = filters.style;
    if (filters.productType) query.productType = filters.productType;

    const products = await this.productModel.find(query).lean();
    return Promise.all(products.map((p) => this.populateVariants(p)));
  }

  async findById(id: string): Promise<PopulatedProduct> {
    const product = await this.productModel.findById(id).lean();
    if (!product) throw new NotFoundException('Product not found');
    return this.populateVariants(product);
  }

  async findBySlug(slug: string): Promise<PopulatedProduct> {
    const product = await this.productModel.findOne({ slug }).lean();
    if (!product) throw new NotFoundException('Product not found');
    return this.populateVariants(product);
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

  async getLoyaltyOnlyProducts(): Promise<PopulatedProduct[]> {
    return this.list({ productType: 'loyalty-only' });
  }

  async getHybridProducts(): Promise<PopulatedProduct[]> {
    return this.list({ productType: 'hybrid' });
  }

  async getRegularProducts(): Promise<PopulatedProduct[]> {
    return this.list({ productType: 'regular' });
  }

  // --- reviews: only rating + review text ---
  async addReview(productId: string, body: any, user: any) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    // Handle both nested and flat request body structures
    const reviewData = body.review || body;
    
    const review = {
      name: user.name || user.email,   // fetch real username/email
      rating: reviewData.rating,
      comment: reviewData.comment || "",  // prevent empty string issue
      createdAt: new Date(),
    };

    product.reviews.push(review);
    await product.save();

    // Return populated product with variants and sizes like other methods
    return this.populateVariants(product);
  }

}
