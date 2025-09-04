import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sale } from './schemas/sale.schema';
import { Model } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<Sale>,
    private notifications: NotificationsService
  ) { }

  async create(data: any) {
    const sale = await this.saleModel.create(data);
    const now = new Date();

    if (!sale.startAt || (sale.startAt && new Date(sale.startAt) <= now)) {
      // Sale starts immediately
      await this.saleModel.findByIdAndUpdate(sale._id, { active: true });
      await this.notifications.createSaleNotification(sale);
    } else {
      // Schedule sale start
      const delay = new Date(sale.startAt).getTime() - now.getTime();
      setTimeout(async () => {
        await this.saleModel.findByIdAndUpdate(sale._id, { active: true });
        await this.notifications.createSaleNotification(sale);
      }, Math.max(0, delay));
    }

    return sale;
  }

  async list() {
    return this.saleModel.find({}).limit(100).lean();
  }

  async getActiveSales() {
    const now = new Date();
    return this.saleModel.find({
      active: true,
      $or: [
        { endAt: { $exists: false } },
        { endAt: { $gt: now } }
      ]
    }).lean();
  }

  async endSale(saleId: string) {
    return this.saleModel.findByIdAndUpdate(saleId, { active: false }, { new: true });
  }
}
