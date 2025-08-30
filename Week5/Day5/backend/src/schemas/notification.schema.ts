import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  type: string; // Start, End, Win, New

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  receiver: Types.ObjectId;

  @Prop({ default: false })
  read: boolean;

  @Prop()
  comment: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
