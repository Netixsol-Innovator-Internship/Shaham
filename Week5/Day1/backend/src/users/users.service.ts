import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UsersGateway } from '../gateway/users.gateway';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly gateway: UsersGateway,
  ) {}

  async create(username: string, email: string, password: string) {
    const exists = await this.userModel.findOne({ $or: [{ email }, { username }] });
    if (exists) throw new BadRequestException('User already exists');
    const hash = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, email, password: hash });
    return user.save();
  }

  async findByIdRaw(id: string) { return this.userModel.findById(id); }
  async findByEmail(email: string) { return this.userModel.findOne({ email }); }
  async findAllIdsExcept(userId: string) {
    const ids = await this.userModel.find({ _id: { $ne: userId } }).select('_id').lean();
    return ids.map(i => i._id as Types.ObjectId);
  }

  async updateProfile(userId: string, data: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(userId, data, { new: true });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async follow(userId: string, targetId: string) {
    if (userId === targetId) throw new BadRequestException('Cannot follow yourself');
    await this.userModel.findByIdAndUpdate(userId, { $addToSet: { following: targetId } });
    await this.userModel.findByIdAndUpdate(targetId, { $addToSet: { followers: userId } });
    this.gateway.server.emit('user:follow', { followerId: userId, targetId });

    return { ok: true };
  }

  async unfollow(userId: string, targetId: string) {
    await this.userModel.findByIdAndUpdate(userId, { $pull: { following: targetId } });
    await this.userModel.findByIdAndUpdate(targetId, { $pull: { followers: userId } });
    this.gateway.server.emit('user:unfollow', { followerId: userId, targetId });

    return { ok: true };
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-password');
  }

}
