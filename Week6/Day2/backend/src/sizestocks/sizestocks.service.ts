import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SizeStock } from './schemas/sizestocks.schema';
import { Model, Types } from 'mongoose';
import { VariantsService } from '../variants/variants.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SizeStockService {
  constructor(
    @InjectModel(SizeStock.name) private sizeModel: Model<SizeStock>, 
    private variants: VariantsService,
    private notifications: NotificationsService,
  ) {}

  async create(variantId: string, data: { size: string; stock: number }) {
    const v = await this.variants.findById(variantId).catch(()=>null);
    if (!v) throw new NotFoundException('Variant not found');

    const created = await this.sizeModel.create({ ...data, variantId: new Types.ObjectId(variantId) });
    return created;
  }

  async update(id: string, data: Partial<{ stock: number; size: string }>) {
    return this.sizeModel.findByIdAndUpdate(id, data, { new: true });
  }

  async listByVariant(variantId: string) {
    return this.sizeModel.find({ variantId }).lean();
  }

  async findById(id: string) {
    const s = await this.sizeModel.findById(id).lean();
    if (!s) throw new NotFoundException('SizeStock not found');
    return s;
  }

  async decrementStock(sizeStockId: string, qty = 1) {
    const updated = await this.sizeModel.findByIdAndUpdate(sizeStockId, { $inc: { stock: -Math.abs(qty) } }, { new: true });
    
    // Check if item went out of stock and notify users with this item in cart
    if (updated && updated.stock <= 0) {
      await this.notifyUsersOfOutOfStock(sizeStockId);
    }
    
    return updated;
  }

  private async notifyUsersOfOutOfStock(sizeStockId: string) {
    try {
      // This would require cart service integration to find users with this item
      // For now, we'll emit a general out-of-stock event
      const sizeStock = await this.findById(sizeStockId);
      const variant = await this.variants.findById(sizeStock.variantId.toString());
      
      if (variant) {
        // Emit socket event for real-time updates
        const globalEmit = (globalThis as any).__realtimeEmit;
        if (globalEmit) {
          globalEmit('product:sold_out', {
            sizeStockId,
            variantId: variant._id,
            productName: `${variant.color} - Size ${sizeStock.size}`
          });
        }
      }
    } catch (error) {
      console.error('Failed to notify users of out-of-stock item:', error);
    }
  }
}
