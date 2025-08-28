import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class UsersGateway {
  @WebSocketServer()
  server: Server;

  emitFollowEvent(payload: any) {
    this.server.emit('user:follow', payload);
  }

  emitUnfollowEvent(payload: any) {
    this.server.emit('user:unfollow', payload);
  }
}
