import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {}

  async create(notification: any) {
    return this.notificationModel.create(notification);
  }

  async createAndBroadcast(notification: any) {
    const created = await this.create(notification);
    try {
      const gw = require('./notifications.gateway').NotificationsGateway.instance;
      if (gw) gw.broadcast(created);
    } catch (e) {}
    return created;
  }

  async listForUser(userId?: string) {
    if (userId) return this.notificationModel.find({ $or: [{ userId }, { userId: null }] }).sort({ createdAt: -1 }).limit(200).lean();
    return this.notificationModel.find({}).sort({ createdAt: -1 }).limit(200).lean();
  }

  async markRead(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { read: true }, { new: true });
  }
}
