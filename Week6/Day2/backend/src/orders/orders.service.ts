import { emitRealtime } from '../realtime/realtime.util';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Variant } from '../variants/schemas/variants.schema';
import { SizeStock } from '../sizestocks/schemas/sizestocks.schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private cart: CartService,
    private users: UsersService,
    private products: ProductsService,
    private notifications: NotificationsService,
    @InjectModel(Variant.name) private variantModel: Model<Variant>,
    @InjectModel(SizeStock.name) private sizeStockModel: Model<SizeStock>,
  ) { }

  async createPaymentIntent(amount: number) {
    if (!process.env.STRIPE_SECRET_KEY)
      throw new InternalServerErrorException('Stripe not configured');
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    return intent;
  }

  async checkout(userId: string, payload: any) {
    const cart = await this.cart.getForUser(userId);
    if (!cart.items.length) throw new BadRequestException('Cart empty');

    let subtotal = 0;
    const itemsSnapshot = [];

    for (const it of cart.items) {
      const qty = it.qty || 1;

      // Load product + variant + sizeStock
      const prod: any = await this.products.findById(it.productId);
      if (!prod) throw new BadRequestException('Invalid product');

      const variant = await this.variantModel.findById(it.variantId).lean();
      if (!variant) throw new BadRequestException('Invalid variant');

      const sizeStock = await this.sizeStockModel.findById(it.sizeStockId);
      if (!sizeStock) throw new BadRequestException('Invalid size/stock');

      if (sizeStock.stock < qty)
        throw new BadRequestException(
          `Insufficient stock for ${prod.name} (${variant.color}, ${sizeStock.size})`,
        );

      // Price calculation
      const moneyPrice = variant.salePrice || variant.regularPrice || 0;
      const pointsPrice = variant.pointsPrice || 0;
      const itemPrice = it.purchaseMethod === 'points' ? 0 : moneyPrice;

      subtotal += itemPrice * qty;

      // Add snapshot item
      itemsSnapshot.push({
        productId: prod._id,
        variantId: variant._id,
        sizeStockId: sizeStock._id,
        name: prod.name,
        color: variant.color,
        size: sizeStock.size,
        qty,
        moneyPrice,
        pointsPrice,
        purchaseMethod: it.purchaseMethod,
      });
    }

    let total = subtotal + 15 - (payload.discount || 0);

    // For points-only purchases, total should be 0
    if (payload.purchaseMethod === 'points') {
      total = 0;
    }

    // Validate payment intent if stripe (skip for points purchases)
    if (payload.paymentMethod === 'stripe' && payload.purchaseMethod !== 'points') {
      if (!payload.paymentIntentId)
        throw new BadRequestException('paymentIntentId required for stripe');
      const intent = await stripe.paymentIntents.retrieve(
        payload.paymentIntentId,
      );
      if (!intent) throw new BadRequestException('Invalid payment intent');
    }

    // Create order
    const order = await this.orderModel.create({
      userId,
      address: payload.address || {},
      items: itemsSnapshot,
      deliveryFee: payload.purchaseMethod === 'points' ? 0 : 15, // No delivery fee for points purchases
      discount: payload.discount || 0,
      subtotal,
      total,
      paymentMethod: payload.paymentMethod || (payload.purchaseMethod === 'points' ? 'points' : 'stripe'),
      paymentIntentId: payload.paymentIntentId,
      pointsUsed: payload.purchaseMethod === 'points' ? subtotal : (payload.pointsUsed || 0),
      pointsEarned: payload.purchaseMethod === 'points' ? 0 : Math.floor(subtotal / 50), // 1 point per $50 as per requirements
      completed: true,
      status: 'completed',
      completedAt: new Date(),
    });

    // Deduct stock & update sold
    for (const it of itemsSnapshot) {
      await this.sizeStockModel.findByIdAndUpdate(it.sizeStockId, {
        $inc: { stock: -it.qty },
      });

      await this.products.incrementSoldCount(it.productId, it.qty);
    }

    // Loyalty points
    if (order.pointsUsed) await this.users.adjustPoints(userId, -order.pointsUsed);
    if (order.pointsEarned) await this.users.adjustPoints(userId, order.pointsEarned);

    // For points-only purchases, calculate points used from items
    if (payload.purchaseMethod === 'points') {
      let totalPointsUsed = 0;
      for (const item of itemsSnapshot) {
        if (item.purchaseMethod === 'points') {
          totalPointsUsed += (item.pointsPrice || 0) * item.qty;
        }
      }
      await this.users.adjustPoints(userId, -totalPointsUsed);
    }

    // Empty cart
    cart.items = [];
    await cart.save();

    // Notify
    await this.notifications.createAndBroadcast({
      userId,
      type: 'order_completed',
      title: 'Order completed',
      payload: { orderId: order._id },
    });

    // Send loyalty points notification
    if (order.pointsEarned > 0) {
      await this.notifications.createLoyaltyPointsNotification(userId, order.pointsEarned, 'earned');
    }
    if (order.pointsUsed > 0) {
      await this.notifications.createLoyaltyPointsNotification(userId, order.pointsUsed, 'spent');
    }

    return order;
  }

  async listForUser(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async getById(id: string) {
    return this.orderModel.findById(id).lean();
  }
}
