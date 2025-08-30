import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any) {
    const created = new this.userModel(createUserDto);
    return created.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async addMyCar(userId: string, carId: string | Types.ObjectId) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { myCars: carId } },
      { new: true },
    );
  }

  async addMyBid(userId: string, bidId: string | Types.ObjectId) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { myBids: bidId } },
      { new: true },
    );
  }

  async addToWishlist(userId: string, carId: string | Types.ObjectId) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: carId } },
      { new: true },
    );
  }

  async removeFromWishlist(userId: string, carId: string | Types.ObjectId) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: carId } },
      { new: true },
    );
  }

  async updateProfile(userId: string, updateData: Partial<User>) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );
  }
}
