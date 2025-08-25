import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Comment {
  @Prop({ required: true })
  text!: string;

  @Prop({ required: true })
  authorId!: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
