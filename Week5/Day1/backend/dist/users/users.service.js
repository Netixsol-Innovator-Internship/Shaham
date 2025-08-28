"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const bcrypt = require("bcrypt");
const users_gateway_1 = require("../gateway/users.gateway");
let UsersService = class UsersService {
    constructor(userModel, gateway) {
        this.userModel = userModel;
        this.gateway = gateway;
    }
    async create(username, email, password) {
        const exists = await this.userModel.findOne({ $or: [{ email }, { username }] });
        if (exists)
            throw new common_1.BadRequestException('User already exists');
        const hash = await bcrypt.hash(password, 10);
        const user = new this.userModel({ username, email, password: hash });
        return user.save();
    }
    async findByIdRaw(id) { return this.userModel.findById(id); }
    async findByEmail(email) { return this.userModel.findOne({ email }); }
    async findAllIdsExcept(userId) {
        const ids = await this.userModel.find({ _id: { $ne: userId } }).select('_id').lean();
        return ids.map(i => i._id);
    }
    async updateProfile(userId, data) {
        const user = await this.userModel.findByIdAndUpdate(userId, data, { new: true });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async follow(userId, targetId) {
        if (userId === targetId)
            throw new common_1.BadRequestException('Cannot follow yourself');
        await this.userModel.findByIdAndUpdate(userId, { $addToSet: { following: targetId } });
        await this.userModel.findByIdAndUpdate(targetId, { $addToSet: { followers: userId } });
        this.gateway.server.emit('user:follow', { followerId: userId, targetId });
        return { ok: true };
    }
    async unfollow(userId, targetId) {
        await this.userModel.findByIdAndUpdate(userId, { $pull: { following: targetId } });
        await this.userModel.findByIdAndUpdate(targetId, { $pull: { followers: userId } });
        this.gateway.server.emit('user:unfollow', { followerId: userId, targetId });
        return { ok: true };
    }
    async findById(id) {
        return this.userModel.findById(id).select('-password');
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_gateway_1.UsersGateway])
], UsersService);
