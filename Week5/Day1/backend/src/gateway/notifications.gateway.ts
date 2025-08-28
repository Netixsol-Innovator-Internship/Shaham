import {
  WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: { origin: process.env.CLIENT_ORIGIN || '*', credentials: true },
  transports: ['websocket', 'polling'],
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit() { console.log('WebSocket gateway initialized'); }

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token || Array.isArray(token)) { client.disconnect(true); return; }
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = decoded.sub;
      (client as any).userId = userId;
      client.join(`user:${userId}`);
      client.emit('connected', { userId });
    } catch (e) {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    // nothing
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
