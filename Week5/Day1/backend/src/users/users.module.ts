import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersGateway } from '../gateway/users.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService, UsersGateway],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
