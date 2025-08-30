import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CarDocument = Car & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class Car {
  @Prop({ required: true, unique: true })
  vin: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop()
  mileage: number;

  @Prop()
  engineSize: string;

  @Prop()
  paint: string;

  @Prop()
  gcc: string;

  @Prop()
  type: string;

  @Prop()
  noteworthyOptions: string;

  @Prop()
  accidentHistory: string;

  @Prop()
  fullServiceHistory: string;

  @Prop()
  hasModified: boolean;

  @Prop({ required: true })
  maxBid: number;

  @Prop({ type: [String], default: [] })
  photos: string[];

  // Auction fields
  @Prop({ required: true })
  startingBid: number;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ default: 100 })
  minimumIncrement: number;

  @Prop({ type: Object, default: null })
  highestBid: any; // { userId, amount, bidId }

  @Prop({ default: 0 })
  totalBids: number;

  @Prop({ type: [{ userId: String, amount: Number, bidId: String }], default: [] })
  bidders: any[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller: Types.ObjectId;

  @Prop({ default: 'draft' })
  status: string; // draft | active | ended | completed
}

export const CarSchema = SchemaFactory.createForClass(Car);
