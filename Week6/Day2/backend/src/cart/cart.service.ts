import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async getForUser(userId: string) {
    let cart = await this.cartModel.findOne({ userId });
    if (!cart) cart = await this.cartModel.create({ userId, items: [] });
    return cart;
  }

  async addItem(userId: string, item: any) {
    const cart = await this.getForUser(userId);
    const existing = cart.items.find((i: any) => i.productId == item.productId && i.purchaseMethod == item.purchaseMethod);
    if (existing) existing.qty = existing.qty + (item.qty || 1);
    else cart.items.push({ ...item, qty: item.qty || 1 });
    await cart.save();
    return cart;
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.getForUser(userId);
    cart.items = cart.items.filter((i: any) => i.productId != productId);
    await cart.save();
    return cart;
  }

  async updateQty(userId: string, productId: string, qty: number) {
    const cart = await this.getForUser(userId);
    const it = cart.items.find((i:any)=>i.productId==productId);
    if (it) it.qty = qty;
    await cart.save();
    return cart;
  }
}
