import { emitRealtime } from '../realtime/realtime.util';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) { }

  async create(notification: any) {
    return this.notificationModel.create(notification);
  }

  async createAndBroadcast(notification: any) {
    const created = await this.create(notification);
    try {
      emitRealtime('notifications:new', created, created.userId ? `user:${created.userId}` : undefined);
      emitRealtime('notifications:new', created, 'admins');
    } catch { }
    return created;
  }

  async createSaleNotification(sale: any) {
    // Notify all users when a sale starts
    const notification = await this.create({
      type: 'sale_started',
      title: `Sale Started: ${sale.title}`,
      body: sale.description || `A new sale has started with ${sale.value}% discount!`,
      payload: { saleId: sale._id, saleType: sale.type, saleValue: sale.value }
    });

    // Broadcast to all users
    emitRealtime('sale:started', notification);
    return notification;
  }

  async createProductSoldOutNotification(userId: string, productName: string) {
    return this.createAndBroadcast({
      userId,
      type: 'product_sold_out',
      title: 'Product Sold Out',
      body: `${productName} in your cart is now sold out.`,
      payload: { productName }
    });
  }

  async createLoyaltyPointsNotification(userId: string, points: number, type: 'earned' | 'spent') {
    return this.createAndBroadcast({
      userId,
      type: `loyalty_points_${type}`,
      title: type === 'earned' ? 'Loyalty Points Earned!' : 'Loyalty Points Spent',
      body: type === 'earned'
        ? `You earned ${points} loyalty points from your purchase!`
        : `You spent ${points} loyalty points on your purchase.`,
      payload: { points, type }
    });
  }

  async listForUser(userId?: string) {
    if (userId) return this.notificationModel.find({ $or: [{ userId }, { userId: null }] }).sort({ createdAt: -1 }).limit(200).lean();
    return this.notificationModel.find({}).sort({ createdAt: -1 }).limit(200).lean();
  }

  async markRead(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { read: true }, { new: true });
  }
}
