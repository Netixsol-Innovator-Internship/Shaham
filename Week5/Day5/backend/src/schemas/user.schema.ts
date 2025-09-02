import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;

  @Prop()
  nationality: string;

  @Prop()
  idType: string;

  @Prop()
  idNumber: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Car' }] , default: [] })
  wishlist: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Car' }], default: [] })
  myCars: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Bid' }], default: [] })
  myBids: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
