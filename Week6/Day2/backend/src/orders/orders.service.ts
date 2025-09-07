import { emitRealtime } from '../realtime/realtime.util';
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Variant } from '../variants/schemas/variants.schema';
import { SizeStock } from '../sizestocks/schemas/sizestocks.schema';
import { LOYALTY_CONSTANTS, PURCHASE_METHODS } from '../common/constants/loyalty.constants';

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


  async checkout(userId: string, payload: any) {
    console.log('=== CHECKOUT PROCESS STARTED ===');
    console.log('User ID:', userId);
    console.log('Payload:', payload);
    
    const cart = await this.cart.getForUser(userId);
    console.log('Cart retrieved:', cart);
    
    if (!cart.items.length) {
      console.log('ERROR: Cart is empty');
      throw new BadRequestException('Cart is empty. Please add items before checkout.');
    }

    let moneySubtotal = 0;
    let pointsSubtotal = 0;
    const itemsSnapshot = [];

    // Calculate totals for each item based on purchase method
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

      // Get pricing based on purchase method
      const moneyPrice = variant.salePrice || variant.regularPrice || 0;
      const pointsPrice = variant.pointsPrice || Math.ceil(moneyPrice / LOYALTY_CONSTANTS.POINT_TO_DOLLAR_RATIO);
      
      let itemMoneyTotal = 0;
      let itemPointsTotal = 0;
      
      // Determine purchase method - use item-level method if available, otherwise use order-level
      const purchaseMethod = it.purchaseMethod || payload.purchaseMethod || PURCHASE_METHODS.MONEY;
      
      if (purchaseMethod === PURCHASE_METHODS.MONEY) {
        itemMoneyTotal = moneyPrice * qty;
      } else if (purchaseMethod === PURCHASE_METHODS.POINTS) {
        itemPointsTotal = pointsPrice * qty;
      } else if (purchaseMethod === PURCHASE_METHODS.HYBRID) {
        // For hybrid, user can choose - default to money if not specified
        if (payload.usePointsForItem && payload.usePointsForItem[it.variantId]) {
          itemPointsTotal = pointsPrice * qty;
        } else {
          itemMoneyTotal = moneyPrice * qty;
        }
      }

      moneySubtotal += itemMoneyTotal;
      pointsSubtotal += itemPointsTotal;

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
        purchaseMethod,
        itemMoneyTotal,
        itemPointsTotal,
      });
    }

    console.log('Calculated totals:', { moneySubtotal, pointsSubtotal });

    // Validate points balance if points are being used
    if (pointsSubtotal > 0) {
      const userPointsBalance = await this.users.getUserPointsBalance(userId);
      if (userPointsBalance < pointsSubtotal) {
        throw new BadRequestException(
          `Insufficient loyalty points. Required: ${pointsSubtotal}, Available: ${userPointsBalance}`
        );
      }
    }

    // Calculate delivery fee (only for money purchases)
    const deliveryFee = moneySubtotal > 0 ? 15 : 0;
    const discount = payload.discount || 0;
    const moneyTotal = Math.max(0, moneySubtotal + deliveryFee - discount);

    // Calculate points earned from money spent (10 points per $50)
    const pointsEarned = moneySubtotal > 0 ? await this.users.calculatePointsFromDollars(moneySubtotal) : 0;

    console.log('Order calculations:', {
      moneySubtotal,
      pointsSubtotal,
      deliveryFee,
      discount,
      moneyTotal,
      pointsEarned
    });

    // Create order
    const order = await this.orderModel.create({
      userId,
      address: payload.address || {},
      items: itemsSnapshot,
      deliveryFee,
      discount,
      subtotal: moneySubtotal,
      total: moneyTotal,
      paymentMethod: moneyTotal > 0 ? 'mock' : 'points',
      pointsUsed: pointsSubtotal,
      pointsEarned,
      completed: true,
      status: 'completed',
      completedAt: new Date(),
    });
    
    console.log('Order created successfully:', order._id);

    // Deduct stock & update sold
    for (const it of itemsSnapshot) {
      await this.sizeStockModel.findByIdAndUpdate(it.sizeStockId, {
        $inc: { stock: -it.qty },
      });

      await this.products.incrementSoldCount(it.productId, it.qty);
    }

    // Handle loyalty points transactions
    if (pointsSubtotal > 0) {
      console.log(`Deducting ${pointsSubtotal} points from user ${userId}`);
      await this.users.deductPoints(userId, pointsSubtotal);
    }
    
    if (pointsEarned > 0) {
      console.log(`Adding ${pointsEarned} points to user ${userId}`);
      await this.users.addPoints(userId, pointsEarned);
    }

    // Empty cart
    console.log('Clearing cart for user:', userId);
    await this.cart.clearCart(userId);

    // Notify
    console.log('Sending order completion notification');
    await this.notifications.createAndBroadcast({
      userId,
      type: 'order_completed',
      title: 'Order completed',
      payload: { orderId: order._id },
    });

    // Send loyalty points notifications
    if (pointsEarned > 0) {
      await this.notifications.createLoyaltyPointsNotification(userId, pointsEarned, 'earned');
    }
    if (pointsSubtotal > 0) {
      await this.notifications.createLoyaltyPointsNotification(userId, pointsSubtotal, 'spent');
    }

    console.log('=== CHECKOUT PROCESS COMPLETED ===');
    return order;
  }

  async listForUser(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async getById(id: string) {
    return this.orderModel.findById(id).lean();
  }
}
