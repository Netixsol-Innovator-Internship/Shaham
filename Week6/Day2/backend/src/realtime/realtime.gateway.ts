
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// NOTE: CORS is permissive by default; tighten in production via environment
@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      process.env.FRONTEND_ORIGIN
    ].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit() {
    // Expose a safe global emitter to avoid circular DI in services
    (globalThis as any).__realtimeEmit = (event: string, data: any, room?: string) => {
      try {
        if (room) this.server.to(room).emit(event, data);
        else this.server.emit(event, data);
      } catch { }
    };
    (globalThis as any).__realtimeServer = this.server;
  }

  handleConnection(client: Socket) {
    // Optional auth: clients can send a userId to join a private room
    const userId = client.handshake.auth?.userId || client.handshake.query?.userId;
    const admin = client.handshake.auth?.admin === true || client.handshake.query?.admin === 'true';
    if (userId) client.join(`user:${userId}`);
    if (admin) client.join('admins');
  }

  handleDisconnect(client: Socket) {
    // Nothing special
  }

  @SubscribeMessage('join')
  onJoin(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const { userId, rooms } = body || {};
    if (userId) client.join(`user:${userId}`);
    if (Array.isArray(rooms)) rooms.forEach((r) => client.join(String(r)));
    client.emit('joined', { rooms: client.rooms });
  }

  // Echo test
  @SubscribeMessage('ping')
  onPing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.emit('pong', data ?? { ok: true });
  }

  // Allow server-side broadcast via REST if needed later
  broadcast(payload: { event: string; data: any; room?: string }) {
    const { event, data, room } = payload;
    if (room) this.server.to(room).emit(event, data);
    else this.server.emit(event, data);
  }
}
