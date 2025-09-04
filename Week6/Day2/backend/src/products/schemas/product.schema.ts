import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true }) name: string;
  @Prop({ unique: true }) slug: string;
  @Prop() description?: string;

  @Prop({
    required: true,
    enum: ['t-shirts', 'shorts', 'shirts', 'hoodie', 'jeans'],
  })
  category: string;

  @Prop() brand?: string;

  @Prop({
    enum: ['casual', 'formal', 'party', 'gym'],
  })
  style?: string;

  @Prop({ default: 0 }) rating: number;
  @Prop({ default: true }) isActive: boolean;
  @Prop({ default: 0 }) sold: number;

  @Prop({ type: [Object], default: [] }) reviews: any[];

  // Loyalty Points System Support
  @Prop({ default: 0 }) pointsPrice?: number;
  @Prop({
    default: 'regular',
    enum: ['regular', 'loyalty-only', 'hybrid']
  }) productType: string;
  @Prop({ default: false }) isLoyaltyOnly: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
