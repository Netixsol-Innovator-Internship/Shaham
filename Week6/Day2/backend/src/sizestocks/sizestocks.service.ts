import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SizeStock } from './schemas/sizestocks.schema';
import { Model, Types } from 'mongoose';
import { VariantsService } from '../variants/variants.service';

@Injectable()
export class SizeStockService {
  constructor(@InjectModel(SizeStock.name) private sizeModel: Model<SizeStock>, private variants: VariantsService) {}

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
    return this.sizeModel.findByIdAndUpdate(sizeStockId, { $inc: { stock: -Math.abs(qty) } }, { new: true });
  }
}
