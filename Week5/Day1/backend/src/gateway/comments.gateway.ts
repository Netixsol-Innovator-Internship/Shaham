import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentsGateway {
  @WebSocketServer()
  server: Server;

  sendNewComment(comment: any) {
    this.server.emit('comment:new', comment);
  }

  sendDeletedComment(commentId: string) {
    this.server.emit('comment:deleted', { id: commentId });
  }

  sendLikeUpdated(payload: { commentId: string; likes: any[] }) {
    this.server.emit('comment:like', payload);
  }

}
