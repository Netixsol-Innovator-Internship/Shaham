import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sale } from './schemas/sale.schema';
import { Model } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<Sale>,
    private notifications: NotificationsService
  ) { }

  private emitSaleEvent(event: 'sale:started' | 'sale:ended', sale: any) {
    try {
      const globalEmit = (globalThis as any).__realtimeEmit;
      if (globalEmit) {
        globalEmit(event, sale);
        this.logger.log(`Emitted ${event} for sale: ${sale.title}`);
      }
    } catch (error) {
      this.logger.error(`Failed to emit ${event}:`, error);
    }
  }

  async create(data: any, userId: string) {
    // Validate dates
    const startAt = new Date(data.startAt);
    const endAt = new Date(data.endAt);
    const now = new Date();

    if (startAt >= endAt) {
      throw new BadRequestException('End date must be after start date');
    }

    if (endAt <= now) {
      throw new BadRequestException('End date must be in the future');
    }

    const saleData = {
      ...data,
      startAt,
      endAt,
      createdBy: userId,
      active: startAt <= now,
      isScheduled: startAt > now
    };

    const sale = await this.saleModel.create(saleData);

    // If sale starts immediately, activate it
    if (startAt <= now) {
      await this.notifications.createSaleStartedNotification(sale);
      this.emitSaleEvent('sale:started', sale);
      this.logger.log(`Sale "${sale.title}" started immediately`);
    } else {
      this.logger.log(`Sale "${sale.title}" scheduled to start at ${startAt}`);
    }

    return sale;
  }

  async list() {
    return this.saleModel.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
  }

  async getActiveSales() {
    const now = new Date();
    return this.saleModel.find({
      active: true,
      startAt: { $lte: now },
      endAt: { $gt: now }
    }).lean();
  }

  async getCurrentSale() {
    const now = new Date();
    return this.saleModel.findOne({
      active: true,
      startAt: { $lte: now },
      endAt: { $gt: now }
    }).lean();
  }

  async updateSale(saleId: string, data: any) {
    const sale = await this.saleModel.findById(saleId);
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // Validate dates if provided
    if (data.startAt || data.endAt) {
      const startAt = new Date(data.startAt || sale.startAt);
      const endAt = new Date(data.endAt || sale.endAt);
      
      if (startAt >= endAt) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    return this.saleModel.findByIdAndUpdate(saleId, data, { new: true });
  }

  async deleteSale(saleId: string) {
    const sale = await this.saleModel.findById(saleId);
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return this.saleModel.findByIdAndDelete(saleId);
  }

  async endSale(saleId: string) {
    const sale = await this.saleModel.findByIdAndUpdate(saleId, { active: false }, { new: true });
    if (sale) {
      await this.notifications.createSaleEndedNotification(sale);
      this.emitSaleEvent('sale:ended', sale);
    }
    return sale;
  }

  // Cron job to check and activate scheduled sales every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async checkScheduledSales() {
    const now = new Date();
    
    // Activate scheduled sales that should start now
    const salesToStart = await this.saleModel.find({
      isScheduled: true,
      active: false,
      startAt: { $lte: now },
      endAt: { $gt: now }
    });

    for (const sale of salesToStart) {
      await this.saleModel.findByIdAndUpdate(sale._id, { 
        active: true, 
        isScheduled: false 
      });
      await this.notifications.createSaleStartedNotification(sale);
      this.emitSaleEvent('sale:started', sale);
      this.logger.log(`Sale "${sale.title}" has been activated`);
    }

    // Deactivate expired sales
    const salesToEnd = await this.saleModel.find({
      active: true,
      endAt: { $lte: now }
    });

    for (const sale of salesToEnd) {
      await this.saleModel.findByIdAndUpdate(sale._id, { active: false });
      await this.notifications.createSaleEndedNotification(sale);
      this.emitSaleEvent('sale:ended', sale);
      this.logger.log(`Sale "${sale.title}" has ended`);
    }
  }

  async getSaleById(saleId: string) {
    const sale = await this.saleModel.findById(saleId);
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }
    return sale;
  }
}
