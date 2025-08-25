import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/comments' })
export class CommentsGateway {
  @WebSocketServer()
  server!: Server;

  emitNewComment(comment: any) {
    this.server.emit('new_comment', comment);
  }

  emitUpdatedComment(comment: any) {
    this.server.emit('comment_updated', comment);
  }

  emitDeletedComment(id: string) {
    this.server.emit('comment_deleted', { _id: id });
  }
}
