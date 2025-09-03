import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Variant, VariantSchema } from './schemas/variants.schema';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { AdminVariantsController } from './admin-variants.controller';
import { ProductsModule } from '../products/products.module';
import { UtilsModule } from '../utils/utils.module';
import { SizeStockModule } from '../sizestocks/sizestocks.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Variant.name, schema: VariantSchema }]),
    ProductsModule,
    SizeStockModule,
    UtilsModule,
  ],
  providers: [VariantsService],
  controllers: [VariantsController, AdminVariantsController],
  exports: [VariantsService],
})
export class VariantsModule {}
