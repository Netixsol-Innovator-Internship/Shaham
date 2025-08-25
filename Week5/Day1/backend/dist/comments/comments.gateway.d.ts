import { Server } from 'socket.io';
export declare class CommentsGateway {
    server: Server;
    emitNewComment(comment: any): void;
    emitUpdatedComment(comment: any): void;
    emitDeletedComment(id: string): void;
}
