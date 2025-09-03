import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true }) email: string;
  @Prop() name: string;
  @Prop() passwordHash: string;
  @Prop({ default: 'user' }) role: string;
  @Prop({ default: 0 }) loyaltyPoints: number;
  @Prop({ default: false }) verified: boolean;
  @Prop() otp?: string;
  @Prop() otpExpiresAt?: Date;
  @Prop() otpRequestedAt?: Date;
  @Prop({ default: false }) blocked: boolean;
  @Prop({ type: [Object], default: [] }) addresses: any[];
  @Prop({ type: [String], default: [] }) orders: string[];
  @Prop({ type: [Object], default: [] }) cart: any[];
}

export const UserSchema = SchemaFactory.createForClass(User);
