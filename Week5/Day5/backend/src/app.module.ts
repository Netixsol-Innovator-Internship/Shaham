import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { BidsModule } from './bids/bids.module';
import { NotificationsModule } from './notifications/notifications.module';
import { GatewaysModule } from './gateways/gateways.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/auctiondb'),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 5, limit: 10, },],
    }),
    AuthModule,
    UsersModule,
    CarsModule,
    BidsModule,
    NotificationsModule,
    GatewaysModule,
  ],
  providers: [],
})
export class AppModule { }
