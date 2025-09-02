import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { Car, CarSchema } from '../schemas/car.schema';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { GatewaysModule } from '../gateways/gateways.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    UsersModule,
    NotificationsModule,
    GatewaysModule,
  ],
  providers: [CarsService],
  controllers: [CarsController],
  exports: [CarsService],
})
export class CarsModule { }
