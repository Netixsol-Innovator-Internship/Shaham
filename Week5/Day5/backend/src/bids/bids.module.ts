import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from '../schemas/bid.schema';
import { Car, CarSchema } from '../schemas/car.schema';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuctionGateway } from '../gateways/auction.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }, { name: Car.name, schema: CarSchema }]),
    UsersModule,
    NotificationsModule,
  ],
  providers: [BidsService, AuctionGateway],
  controllers: [BidsController],
  exports: [BidsService],
})
export class BidsModule {}
