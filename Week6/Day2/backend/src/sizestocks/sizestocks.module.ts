import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SizeStock, SizeStockSchema } from './schemas/sizestocks.schema';
import { SizeStockService } from './sizestocks.service';
import { SizeStockController, PublicSizeStockController } from './sizestocks.controller';
import { VariantsModule } from '../variants/variants.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SizeStock.name, schema: SizeStockSchema }]),
    forwardRef(() => VariantsModule),
  ],
  providers: [SizeStockService],
  controllers: [SizeStockController, PublicSizeStockController],
  exports: [SizeStockService],
})
export class SizeStockModule { }
