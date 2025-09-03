import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection {
  static instance: NotificationsGateway;
  constructor(private jwtService: JwtService) {
    NotificationsGateway.instance = this;
  }

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.query?.token as string;
      if (token) {
        const payload = this.jwtService.verify(token);
        client.join('user:' + payload.sub);
        client.data.user = payload;
      }
    } catch (err) {
      // ignore
    }
  }

  broadcast(notification: any) {
    if (!this.server) return;
    if (notification.userId) {
      this.server.to('user:' + notification.userId).emit('notification', notification);
    } else {
      this.server.emit('notification', notification);
    }
  }
}
