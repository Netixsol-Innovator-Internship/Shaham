import { Module } from '@nestjs/common';
import { RealtimeModule } from './realtime/realtime.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import { VariantsModule } from './variants/variants.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import {SizeStockModule} from './sizestocks/sizestocks.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UtilsModule } from './utils/utils.module';


console.log('MONGO_URI from env:', process.env.MONGO_URI);

@Module({
  imports: [
    RealtimeModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule,
    ProductsModule,
    SalesModule,
    SizeStockModule,
    VariantsModule,
    CartModule,
    OrdersModule,
    NotificationsModule,
    UtilsModule,
  ],
})
export class AppModule {}
