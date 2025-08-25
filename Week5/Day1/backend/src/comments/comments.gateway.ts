import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/comments',
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  },
})
export class CommentsGateway implements OnModuleInit {
  @WebSocketServer()
  server!: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      // eslint-disable-next-line no-console
      console.log('Client connected:', socket.id);
    });
  }

  emitNewComment(comment: any) {
    this.server.emit('new_comment', comment);
  }
}
