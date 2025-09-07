import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AdminProductsController } from './admin-products.controller';
import { Product, ProductSchema } from './schemas/product.schema';
import { Variant, VariantSchema } from '../variants/schemas/variants.schema';
import { SizeStock, SizeStockSchema } from '../sizestocks/schemas/sizestocks.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Variant.name, schema: VariantSchema },
      { name: SizeStock.name, schema: SizeStockSchema },
    ]),
    PassportModule,
    AuthModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController, AdminProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
