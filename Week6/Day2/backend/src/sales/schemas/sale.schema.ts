import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
  @Prop() title: string;
  @Prop() description?: string;
  @Prop({ default: 'percentage' }) type: string;
  @Prop() value: number;
  @Prop({ type: [String], default: [] }) productIds: string[];
  @Prop() startAt?: Date;
  @Prop() endAt?: Date;
  @Prop({ default: false }) active: boolean;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
