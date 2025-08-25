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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schemas_1 = require("./schemas");
let CommentsService = class CommentsService {
    constructor(commentModel) {
        this.commentModel = commentModel;
    }
    async create(data) {
        const created = await this.commentModel.create(data);
        return created;
    }
    async list(limit = 50) {
        return this.commentModel.find().sort({ createdAt: -1 }).limit(limit).lean();
    }
    async update(id, authorId, text) {
        const comment = await this.commentModel.findById(id);
        if (!comment)
            throw new Error('Comment not found');
        if (comment.authorId !== authorId)
            throw new Error('Not allowed');
        comment.text = text;
        await comment.save();
        return comment.toObject();
    }
    async delete(id, authorId) {
        const comment = await this.commentModel.findById(id);
        if (!comment)
            throw new Error('Comment not found');
        if (comment.authorId !== authorId)
            throw new Error('Not allowed');
        await comment.deleteOne();
        return { _id: id };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(schemas_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommentsService);
//# sourceMappingURL=comments.service.js.map