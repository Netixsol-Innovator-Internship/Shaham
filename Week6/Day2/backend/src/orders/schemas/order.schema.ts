import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Object, default: {} })
  address: any;

  @Prop({ type: [Object], default: [] })
  items: any[];

  @Prop({ default: 15 })
  deliveryFee: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  total: number;

  @Prop({ type: String })
  paymentMethod?: string;

  @Prop({ type: String })
  paymentIntentId?: string;

  @Prop({ default: 0 })
  pointsUsed: number;

  @Prop({ default: 0 })
  pointsEarned: number;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ type: Date })
  completedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
