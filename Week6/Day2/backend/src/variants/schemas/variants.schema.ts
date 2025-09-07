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

  @Prop({ type: Number, min: 0, max: 100, default: 0 }) discountPercentage?: number;
  @Prop({ required: true }) regularPrice: number;
  @Prop() salePrice?: number;

  // Loyalty Points System Support
  @Prop({ default: 0 }) pointsPrice?: number;
  @Prop({
    default: 'money',
    enum: ['money', 'points', 'hybrid']
  }) purchaseMethod: string;
}

const VariantSchema = SchemaFactory.createForClass(Variant);

// Add pre-save middleware to calculate salePrice based on discountPercentage
VariantSchema.pre('save', function(next) {
  if (this.isModified('discountPercentage') || this.isModified('regularPrice')) {
    if (this.discountPercentage > 0) {
      this.salePrice = Math.round(this.regularPrice * (1 - this.discountPercentage / 100) * 100) / 100; // Round to 2 decimal places
    } else {
      this.salePrice = undefined;
    }
  }
  next();
});

export { VariantSchema };
