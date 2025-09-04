import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop() userId: string;
  @Prop({
    type: [Object],
    default: []
  }) items: Array<{
    productId: string;
    variantId: string;
    sizeStockId: string;
    qty: number;
    purchaseMethod: 'money' | 'points' | 'hybrid';
    pointsPrice?: number;
    moneyPrice?: number;
  }>;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
