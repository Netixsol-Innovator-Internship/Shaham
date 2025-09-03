import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sale } from './schemas/sale.schema';
import { Model } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);
  constructor(@InjectModel(Sale.name) private saleModel: Model<Sale>, private notifications: NotificationsService) {}

  async create(data: any) {
    const sale = await this.saleModel.create(data);
    const now = new Date();
    if (!sale.startAt || (sale.startAt && new Date(sale.startAt) <= now)) {
      await this.saleModel.findByIdAndUpdate(sale._id, { active: true });
      await this.notifications.createAndBroadcast({ type: 'sale_started', title: sale.title, payload: { saleId: sale._id.toString() } });
    } else {
      const delay = new Date(sale.startAt).getTime() - now.getTime();
      setTimeout(async () => {
        await this.saleModel.findByIdAndUpdate(sale._id, { active: true });
        await this.notifications.createAndBroadcast({ type: 'sale_started', title: sale.title, payload: { saleId: sale._id.toString() } });
      }, Math.max(0, delay));
    }
    return sale;
  }

  async list() {
    return this.saleModel.find({}).limit(100).lean();
  }
}
