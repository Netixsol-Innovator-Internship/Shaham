import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  async create(data: { text: string; authorId: string }) {
    const created = await this.commentModel.create(data as any);
    return created;
  }

  async list(limit = 50) {
    return this.commentModel.find().sort({ createdAt: -1 }).limit(limit).lean();
  }

  async update(id: string, authorId: string, text: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new Error('Comment not found');
    if (comment.authorId !== authorId) throw new Error('Not allowed');

    comment.text = text;
    await comment.save();
    return comment.toObject();
  }

  async delete(id: string, authorId: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new Error('Comment not found');
    if (comment.authorId !== authorId) throw new Error('Not allowed');

    await comment.deleteOne();
    return { _id: id };
  }

}
