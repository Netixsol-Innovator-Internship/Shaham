import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string) {
    return this.userModel.findById(id).select('-passwordHash -otp -otpExpiresAt -otpRequestedAt').lean();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }

  async adjustPoints(userId: string, change: number) {
    return this.userModel.findByIdAndUpdate(userId, { $inc: { loyaltyPoints: change } }, { new: true });
  }

  async addOrder(userId: string, orderId: string) {
    return this.userModel.findByIdAndUpdate(userId, { $push: { orders: orderId } });
  }

  async setRole(userId: string, role: string) {
    return this.userModel.findByIdAndUpdate(userId, { role }, { new: true });
  }

  async blockUser(userId: string, block=true) {
    return this.userModel.findByIdAndUpdate(userId, { blocked: block }, { new: true });
  }
}
