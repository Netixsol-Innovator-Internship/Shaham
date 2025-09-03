import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop() userId?: string;
  @Prop() type: string;
  @Prop() title: string;
  @Prop() body?: string;
  @Prop({ type: Object }) payload?: any;
  @Prop({ default: false }) read?: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
