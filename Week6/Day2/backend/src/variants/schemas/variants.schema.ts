import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VariantDocument = Variant & Document;

@Schema({ timestamps: true })
export class Variant {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({
    required: true,
    enum: [
      'green', 'red', 'yellow', 'orange',
      'blue', 'navy', 'purple', 'pink',
      'white', 'black',
    ],
  })
  color: string;

  @Prop({ required: true }) sku: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 0 }) discount?: number;
  @Prop({ required: true }) regularPrice: number;
  @Prop() salePrice?: number;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
