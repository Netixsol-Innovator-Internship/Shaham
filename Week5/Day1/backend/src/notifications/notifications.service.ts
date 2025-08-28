import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { NotificationsGateway } from '../gateway/notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private model: Model<Notification>,
    private gateway: NotificationsGateway,
  ) {}

  async create(payload: { recipient: string; actor: string; type: 'comment' | 'reply' | 'like'; comment?: string }) {
    const n = await this.model.create(payload);

    const populated = await this.model
      .findById(n._id)
      .populate('actor', 'username email avatarUrl')
      .lean();

    const toSend = populated || n.toJSON();
    this.gateway.emitToUser(payload.recipient, 'notification:new', toSend);

    return toSend;
  }

  async bulkCreate(
    items: { recipient: string; actor: string; type: 'comment' | 'reply' | 'like'; comment?: string }[],
  ) {
    if (items.length === 0) return [];

    const inserted = await this.model.insertMany(items);

    const populated = await this.model
      .find({ _id: { $in: inserted.map((i) => i._id) } })
      .populate('actor', 'username email avatarUrl')
      .lean();

    const byId = Object.fromEntries(populated.map((n) => [String(n._id), n]));

    inserted.forEach((i) => {
      const notif = byId[String(i._id)] || i.toJSON();
      this.gateway.emitToUser(String(i.recipient), 'notification:new', notif);
    });

    return populated;
  }

  async list(recipient: string) {
    return this.model
      .find({ recipient })
      .sort({ createdAt: -1 })
      .populate('actor', 'username email avatarUrl')
      .lean();
  }

  async markRead(recipient: string, id: string) {
    return this.model.findOneAndUpdate(
      { _id: id, recipient },
      { $set: { read: true } },
      { new: true },
    );
  }

  async markAllRead(recipient: string) {
    await this.model.updateMany({ recipient }, { $set: { read: true } });
    return { ok: true };
  }
}
