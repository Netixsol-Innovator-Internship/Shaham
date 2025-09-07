import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
  @Prop({ required: true }) title: string;
  @Prop() description?: string;
  @Prop({ default: 'percentage' }) type: string;
  @Prop({ required: true, min: 0, max: 100 }) discountPercentage: number;
  @Prop({ type: [String], default: [] }) productIds: string[];
  @Prop({ required: true }) startAt: Date;
  @Prop({ required: true }) endAt: Date;
  @Prop({ default: false }) active: boolean;
  @Prop({ default: false }) isScheduled: boolean;
  @Prop() createdBy: string; // User ID who created the sale
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
