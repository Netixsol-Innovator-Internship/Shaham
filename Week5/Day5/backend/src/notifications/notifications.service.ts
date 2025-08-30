import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from '../schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {}

  async create(dto: any) {
    // If receiver is null => broadcast to all: for simplicity, create a notification with receiver=null
    const n = new this.notificationModel(dto);
    return n.save();
  }

  async listForUser(userId: string) {
    // include broadcast notifications (receiver=null) and specific ones
    return this.notificationModel.find({ $or: [{ receiver: null }, { receiver: userId }] }).sort({ createdAt: -1 }).limit(200).exec();
  }

  async markRead(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { read: true });
  }
}
