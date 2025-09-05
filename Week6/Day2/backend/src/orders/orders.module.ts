import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { UsersModule } from '../users/users.module';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UtilsModule } from '../utils/utils.module';
import { Variant, VariantSchema } from '../variants/schemas/variants.schema';
import { SizeStock, SizeStockSchema } from '../sizestocks/schemas/sizestocks.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Variant.name, schema: VariantSchema },
      { name: SizeStock.name, schema: SizeStockSchema },
    ]),
    UsersModule,
    CartModule,
    ProductsModule,
    NotificationsModule,
    UtilsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule { }
