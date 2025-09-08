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

  async createSaleStartedNotification(sale: any) {
    // Notify all users when a sale starts
    const notification = await this.create({
      type: 'sale_started',
      title: `Sale Started: ${sale.title}`,
      body: sale.description || `A new sale has started with ${sale.discountPercentage}% discount!`,
      payload: { saleId: sale._id, saleType: sale.type, saleValue: sale.discountPercentage }
    });

    // Broadcast to all users
    emitRealtime('sale:started', notification);
    return notification;
  }

  async createSaleEndedNotification(sale: any) {
    // Notify all users when a sale ends
    const notification = await this.create({
      type: 'sale_ended',
      title: `Sale Ended: ${sale.title}`,
      body: `The ${sale.title} sale has ended. Don't miss our next sale!`,
      payload: { saleId: sale._id }
    });

    // Broadcast to all users
    emitRealtime('sale:ended', notification);
    return notification;
  }

  async createNewProductNotification(product: any) {
    // Notify all users when a new product is added
    const notification = await this.create({
      type: 'new_product',
      title: 'New Product Added!',
      body: `Check out our new ${product.name} - now available in store!`,
      payload: { productId: product._id, productName: product.name }
    });

    // Broadcast to all users
    emitRealtime('new_product', notification);
    return notification;
  }

  async createRoleUpdateNotification(userId: string, newRole: string, oldRole: string) {
    // Notify specific user when their role is updated
    const isPromotion = (newRole === 'admin' || newRole === 'super_admin') && oldRole === 'user';
    const isDemotion = oldRole === 'admin' || oldRole === 'super_admin';
    
    const notification = await this.createAndBroadcast({
      userId,
      type: 'role_updated',
      title: isPromotion ? 'Congratulations! You\'ve been promoted!' : 'Role Updated',
      body: isPromotion 
        ? `You have been promoted to ${newRole}. You now have access to admin features!`
        : `Your role has been updated to ${newRole}.`,
      payload: { newRole, oldRole, isPromotion, isDemotion }
    });

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
