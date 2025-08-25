import { CommentsService } from './comments.service';
import { CommentsGateway } from './comments.gateway';
export declare class CommentsController {
    private readonly commentsService;
    private readonly gateway;
    constructor(commentsService: CommentsService, gateway: CommentsGateway);
    list(): Promise<(import("mongoose").FlattenMaps<{
        text: string;
        authorId: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    create(body: {
        text: string;
        authorId: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./schemas").Comment, {}, {}> & import("./schemas").Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | {
        error: string;
    }>;
}
