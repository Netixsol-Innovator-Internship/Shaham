import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SizeStock, SizeStockSchema } from './schemas/sizestocks.schema';
import { SizeStockService } from './sizestocks.service';
import { SizeStockController } from './sizestocks.controller';
import { VariantsModule } from '../variants/variants.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: SizeStock.name, schema: SizeStockSchema }]), VariantsModule],
  providers: [SizeStockService],
  controllers: [SizeStockController],
  exports: [SizeStockService],
})
export class SizeStockModule {}
