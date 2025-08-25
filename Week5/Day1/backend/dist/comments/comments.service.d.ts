import { Model } from 'mongoose';
import { Comment } from './schemas';
export declare class CommentsService {
    private commentModel;
    constructor(commentModel: Model<Comment>);
    create(data: {
        text: string;
        authorId: string;
    }): Promise<import("mongoose").Document<unknown, {}, Comment, {}, {}> & Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    list(limit?: number): Promise<(import("mongoose").FlattenMaps<{
        text: string;
        authorId: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
