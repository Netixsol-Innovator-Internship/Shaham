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

  private async getRawCart(userId: string) {
    let cart = await this.cartModel.findOne({ userId });
    if (!cart) cart = await this.cartModel.create({ userId, items: [] });
    return cart;
  }

  async getForUser(userId: string) {
    const cart = await this.getRawCart(userId);
    
    // Populate cart items with product details
    const populatedItems = await Promise.all(
      cart.items.map(async (item: any) => {
        try {
          const product = await this.productsService.findById(item.productId);
          if (!product) return item;

          const variant = product.variants?.find((v: any) => v._id.toString() === item.variantId);
          if (!variant) return item;

          // Find size details from variant's sizes
          const sizeStock = variant.sizes?.find((s: any) => s._id.toString() === item.sizeStockId);
          
          return {
            ...item,
            name: product.name,
            image: variant.images?.[0] || '/shirt.png',
            color: variant.color,
            size: sizeStock?.size || 'Unknown',
            moneyPrice: variant.salePrice || variant.regularPrice,
            pointsPrice: variant.pointsPrice || 0,
          };
        } catch (error) {
          console.error('Error populating cart item:', error);
          return item;
        }
      })
    );

    return {
      _id: cart._id,
      userId: cart.userId,
      items: populatedItems,
    };
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

    const cart = await this.getRawCart(userId);
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

    // Mark the items array as modified to ensure Mongoose detects the change
    cart.markModified('items');
    await cart.save();
    return this.getForUser(userId);
  }

  async removeItem(userId: string, productId: string, variantId?: string, sizeStockId?: string, purchaseMethod?: string) {
    const cart = await this.getRawCart(userId);
    cart.items = cart.items.filter((i: any) => {
      if (variantId && sizeStockId && purchaseMethod) {
        return !(i.productId == productId && i.variantId == variantId && i.sizeStockId == sizeStockId && i.purchaseMethod == purchaseMethod);
      }
      return i.productId != productId;
    });
    
    // Mark the items array as modified to ensure Mongoose detects the change
    cart.markModified('items');
    await cart.save();
    return this.getForUser(userId);
  }

  async updateQty(userId: string, productId: string, variantId: string, sizeStockId: string, purchaseMethod: string, qty: number) {
    console.log('=== CART SERVICE UPDATE QTY ===');
    console.log('Looking for item with:', { productId, variantId, sizeStockId, purchaseMethod, qty });
    
    const cart = await this.getRawCart(userId);
    console.log('Current cart items:', cart.items);
    
    const item = cart.items.find((i: any) => {
      const matches = {
        productId: i.productId == productId,
        variantId: i.variantId == variantId,
        sizeStockId: i.sizeStockId == sizeStockId,
        purchaseMethod: i.purchaseMethod == purchaseMethod
      };
      console.log(`Checking item:`, {
        item: i,
        searchCriteria: { productId, variantId, sizeStockId, purchaseMethod },
        matches
      });
      return matches.productId && matches.variantId && matches.sizeStockId && matches.purchaseMethod;
    });
    
    console.log('Found item:', item);

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

      console.log('Updating item qty from', item.qty, 'to', qty);
      item.qty = qty;
      console.log('Item qty after update:', item.qty);
      
      // Mark the items array as modified to ensure Mongoose detects the change
      cart.markModified('items');
    } else {
      console.log('Item not found - cannot update quantity');
    }

    console.log('Saving cart...');
    await cart.save();
    console.log('Cart saved successfully');
    
    const updatedCart = await this.getForUser(userId);
    console.log('Returning updated cart:', updatedCart);
    return updatedCart;
  }

  async clearCart(userId: string) {
    const cart = await this.getRawCart(userId);
    cart.items = [];
    // Mark the items array as modified to ensure Mongoose detects the change
    cart.markModified('items');
    await cart.save();
    return cart;
  }
}
