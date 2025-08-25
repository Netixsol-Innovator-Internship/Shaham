import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
export declare class CommentsGateway implements OnModuleInit {
    server: Server;
    onModuleInit(): void;
    emitNewComment(comment: any): void;
}
