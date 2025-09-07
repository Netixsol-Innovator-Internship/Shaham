import { Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { LOYALTY_CONSTANTS } from '../common/constants/loyalty.constants';

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

  async validatePointsBalance(userId: string, requiredPoints: number): Promise<boolean> {
    const user = await this.userModel.findById(userId).select('loyaltyPoints').lean();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.loyaltyPoints >= requiredPoints;
  }

  async getUserPointsBalance(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId).select('loyaltyPoints').lean();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.loyaltyPoints;
  }

  async deductPoints(userId: string, points: number) {
    const hasBalance = await this.validatePointsBalance(userId, points);
    if (!hasBalance) {
      const currentBalance = await this.getUserPointsBalance(userId);
      throw new BadRequestException(
        `Insufficient loyalty points. Required: ${points}, Available: ${currentBalance}`
      );
    }
    return this.adjustPoints(userId, -points);
  }

  async addPoints(userId: string, points: number) {
    return this.adjustPoints(userId, points);
  }

  async calculatePointsFromDollars(dollarAmount: number): Promise<number> {
    return Math.floor(dollarAmount / LOYALTY_CONSTANTS.SPEND_THRESHOLD) * LOYALTY_CONSTANTS.POINTS_PER_SPEND_THRESHOLD;
  }

  async convertPointsToDollars(points: number): Promise<number> {
    return points * LOYALTY_CONSTANTS.POINT_TO_DOLLAR_RATIO;
  }

  async addOrder(userId: string, orderId: string) {
    return this.userModel.findByIdAndUpdate(userId, { $push: { orders: orderId } });
  }

  async updateProfile(userId: string, updateData: any) {
    return this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');
  }

  async getAllUsers() {
    return this.userModel.find({}).select('-password').lean();
  }

  async updateUserRole(userId: string, role: string) {
    const validRoles = ['user', 'admin', 'super_admin'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role');
    }
    
    return this.userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');
  }

  async updateUserBlockStatus(userId: string, isBlocked: boolean) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    ).select('-password');
  }

  async blockUser(userId: string, block=true) {
    return this.userModel.findByIdAndUpdate(userId, { isBlocked: block }, { new: true });
  }

  async setRole(userId: string, role: string) {
    return this.userModel.findByIdAndUpdate(userId, { role }, { new: true });
  }
}
