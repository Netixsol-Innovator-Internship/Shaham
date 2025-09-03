import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SizeStockDocument = SizeStock & Document;

@Schema({ timestamps: true })
export class SizeStock {
  @Prop({ type: Types.ObjectId, ref: 'Variant', required: true })
  variantId: Types.ObjectId;

  @Prop({
    required: true,
    enum: [
      'xx-small', 'x-small', 'small', 'medium',
      'large', 'x-large', 'xx-large',
      '3x-large', '4x-large',
    ],
  })
  size: string;

  @Prop({ required: true, default: 0 })
  stock: number;
}

export const SizeStockSchema = SchemaFactory.createForClass(SizeStock);
