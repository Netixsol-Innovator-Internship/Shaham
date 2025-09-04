import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) { }

  async getForUser(userId: string) {
    let cart = await this.cartModel.findOne({ userId });
    if (!cart) cart = await this.cartModel.create({ userId, items: [] });
    return cart;
  }

  async addItem(userId: string, item: any) {
    // Validate purchase method and points if needed
    if (item.purchaseMethod === 'points') {
      const user = await this.usersService.findById(userId);
      if (!user) throw new BadRequestException('User not found');

      // Get product details to check points price
      const product = await this.productsService.findById(item.productId);
      if (!product) throw new BadRequestException('Product not found');

      // The product service returns variants as a populated property
      if (!product.variants || !Array.isArray(product.variants)) {
        throw new BadRequestException('Product has no variants');
      }

      const variant = product.variants.find((v: any) => v._id.toString() === item.variantId);
      if (!variant) throw new BadRequestException('Variant not found');

      if (!variant.pointsPrice || variant.pointsPrice <= 0) {
        throw new BadRequestException('This product cannot be purchased with points');
      }

      const totalPointsNeeded = variant.pointsPrice * (item.qty || 1);
      if (user.loyaltyPoints < totalPointsNeeded) {
        throw new BadRequestException(`Insufficient loyalty points. Need ${totalPointsNeeded}, have ${user.loyaltyPoints}`);
      }
    }

    const cart = await this.getForUser(userId);
    const existing = cart.items.find((i: any) =>
      i.productId == item.productId &&
      i.variantId == item.variantId &&
      i.sizeStockId == item.sizeStockId &&
      i.purchaseMethod == item.purchaseMethod
    );

    if (existing) {
      existing.qty = existing.qty + (item.qty || 1);
    } else {
      cart.items.push({ ...item, qty: item.qty || 1 });
    }

    await cart.save();
    return cart;
  }

  async removeItem(userId: string, productId: string, variantId?: string, sizeStockId?: string, purchaseMethod?: string) {
    const cart = await this.getForUser(userId);
    cart.items = cart.items.filter((i: any) => {
      if (variantId && sizeStockId && purchaseMethod) {
        return !(i.productId == productId && i.variantId == variantId && i.sizeStockId == sizeStockId && i.purchaseMethod == purchaseMethod);
      }
      return i.productId != productId;
    });
    await cart.save();
    return cart;
  }

  async updateQty(userId: string, productId: string, variantId: string, sizeStockId: string, purchaseMethod: string, qty: number) {
    const cart = await this.getForUser(userId);
    const item = cart.items.find((i: any) =>
      i.productId == productId &&
      i.variantId == variantId &&
      i.sizeStockId == sizeStockId &&
      i.purchaseMethod == purchaseMethod
    );

    if (item) {
      // Validate points if updating to points purchase
      if (purchaseMethod === 'points') {
        const user = await this.usersService.findById(userId);
        if (!user) throw new BadRequestException('User not found');

        const product = await this.productsService.findById(productId);
        if (!product) throw new BadRequestException('Product not found');

        // The product service returns variants as a populated property
        if (!product.variants || !Array.isArray(product.variants)) {
          throw new BadRequestException('Product has no variants');
        }

        const variant = product.variants.find((v: any) => v._id.toString() === variantId);
        if (!variant) throw new BadRequestException('Variant not found');

        const totalPointsNeeded = variant.pointsPrice * qty;
        if (user.loyaltyPoints < totalPointsNeeded) {
          throw new BadRequestException(`Insufficient loyalty points. Need ${totalPointsNeeded}, have ${user.loyaltyPoints}`);
        }
      }

      item.qty = qty;
    }

    await cart.save();
    return cart;
  }
}
