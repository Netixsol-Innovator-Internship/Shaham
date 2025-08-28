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
const comment_schema_1 = require("./schemas/comment.schema");
const users_service_1 = require("../users/users.service");
const notifications_service_1 = require("../notifications/notifications.service");
const comments_gateway_1 = require("../gateway/comments.gateway");
let CommentsService = class CommentsService {
    constructor(commentModel, usersService, notifications, commentsGateway) {
        this.commentModel = commentModel;
        this.usersService = usersService;
        this.notifications = notifications;
        this.commentsGateway = commentsGateway;
    }
    async create(authorId, content, parentComment) {
        const comment = await this.commentModel.create({
            author: authorId,
            content,
            parentComment: parentComment || null,
        });
        const populated = await this.commentModel
            .findById(comment._id)
            .populate('author', 'username email avatarUrl')
            .lean();
        if (parentComment) {
            const parent = await this.commentModel.findById(parentComment);
            if (parent && String(parent.author) !== String(authorId)) {
                await this.notifications.create({
                    recipient: String(parent.author),
                    actor: authorId,
                    type: 'reply',
                    comment: comment.id,
                });
            }
        }
        else {
            const allUserIds = await this.usersService.findAllIdsExcept(authorId);
            await this.notifications.bulkCreate(allUserIds.map((uid) => ({
                recipient: String(uid),
                actor: authorId,
                type: 'comment',
                comment: comment.id,
            })));
        }
        this.commentsGateway.sendNewComment(populated);
        return populated;
    }
    async findById(id) {
        const c = await this.commentModel.findById(id).populate('author', 'username email avatarUrl');
        if (!c)
            throw new common_1.NotFoundException('Comment not found');
        return c;
    }
    async list(parentComment) {
        const filter = {};
        if (parentComment === undefined) {
            filter.parentComment = null;
        }
        else {
            filter.parentComment = parentComment;
        }
        return this.commentModel.find(filter).sort({ createdAt: -1 }).populate('author', 'username email avatarUrl').lean();
    }
    async remove(id, userId) {
        const comment = await this.commentModel.findById(id);
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.author.toString() !== userId.toString()) {
            throw new common_1.UnauthorizedException('You can only delete your own comments');
        }
        await this.deleteWithChildren(id);
        return { id };
    }
    async deleteWithChildren(commentId) {
        const children = await this.commentModel.find({ parentComment: commentId });
        for (const child of children) {
            await this.deleteWithChildren(child._id.toString());
        }
        await this.commentModel.findByIdAndDelete(commentId).exec();
        this.commentsGateway.sendDeletedComment(commentId);
    }
    async like(commentId, userId) {
        const updated = await this.commentModel
            .findByIdAndUpdate(commentId, { $addToSet: { likes: userId } }, { new: true })
            .populate('author', 'username email avatarUrl')
            .lean();
        if (!updated)
            throw new common_1.NotFoundException('Comment not found');
        if (String(updated.author._id) !== String(userId)) {
            await this.notifications.create({
                recipient: String(updated.author._id),
                actor: userId,
                type: 'like',
                comment: commentId,
            });
        }
        this.commentsGateway.sendLikeUpdated({
            commentId: String(updated._id),
            likes: updated.likes,
        });
        return updated;
    }
    async unlike(commentId, userId) {
        const updated = await this.commentModel
            .findByIdAndUpdate(commentId, { $pull: { likes: userId } }, { new: true })
            .populate('author', 'username email avatarUrl')
            .lean();
        if (!updated)
            throw new common_1.NotFoundException('Comment not found');
        this.commentsGateway.sendLikeUpdated({
            commentId: String(updated._id),
            likes: updated.likes,
        });
        return updated;
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService,
        notifications_service_1.NotificationsService,
        comments_gateway_1.CommentsGateway])
], CommentsService);
