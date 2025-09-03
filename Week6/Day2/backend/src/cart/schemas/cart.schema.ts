import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop() userId: string;
  @Prop({ type: [Object], default: [] }) items: any[]; // { productId, qty, purchaseMethod }
}

export const CartSchema = SchemaFactory.createForClass(Cart);
