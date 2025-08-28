import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CommentsGateway } from '../gateway/comments.gateway';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private usersService: UsersService,
    private notifications: NotificationsService,
    private commentsGateway: CommentsGateway,
  ) {}

  async create(authorId: string, content: string, parentComment?: string) {
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
    } else {
      const allUserIds = await this.usersService.findAllIdsExcept(authorId);
      await this.notifications.bulkCreate(
        allUserIds.map((uid) => ({
          recipient: String(uid),
          actor: authorId,
          type: 'comment',
          comment: comment.id,
        })),
      );
    }

    this.commentsGateway.sendNewComment(populated);
    return populated;
  }

  async findById(id: string) {
    const c = await this.commentModel.findById(id).populate('author', 'username email avatarUrl');
    if (!c) throw new NotFoundException('Comment not found');
    return c;
  }

  async list(parentComment?: string) {
    const filter: any = {};
    if (parentComment === undefined) { filter.parentComment = null; }
    else { filter.parentComment = parentComment; }
    return this.commentModel.find(filter).sort({ createdAt: -1 }).populate('author', 'username email avatarUrl').lean();
  }

  async remove(id: string, userId: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.toString() !== userId.toString()) {
      throw new UnauthorizedException('You can only delete your own comments');
    }
    await this.deleteWithChildren(id);
    return { id };
  }

  private async deleteWithChildren(commentId: string) {
    const children = await this.commentModel.find({ parentComment: commentId });

    for (const child of children) {
      await this.deleteWithChildren(child._id.toString());
    }
    await this.commentModel.findByIdAndDelete(commentId).exec();
    this.commentsGateway.sendDeletedComment(commentId);
  }

  async like(commentId: string, userId: string) {
    const updated = await this.commentModel
      .findByIdAndUpdate(
        commentId,
        { $addToSet: { likes: userId } },
        { new: true },
      )
      .populate('author', 'username email avatarUrl')
      .lean();

    if (!updated) throw new NotFoundException('Comment not found');

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
  async unlike(commentId: string, userId: string) {
    const updated = await this.commentModel
      .findByIdAndUpdate(
        commentId,
        { $pull: { likes: userId } },
        { new: true },
      )
      .populate('author', 'username email avatarUrl')
      .lean();

    if (!updated) throw new NotFoundException('Comment not found');

    this.commentsGateway.sendLikeUpdated({
      commentId: String(updated._id),
      likes: updated.likes,
    });

    return updated;
  }
}
