import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: true } })
@Injectable()
export class AuctionGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { auctionId } = data;
    client.join(auctionId);
    client.emit('joined', { auctionId });
  }

  @SubscribeMessage('leave')
  handleLeave(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { auctionId } = data;
    client.leave(auctionId);
    client.emit('left', { auctionId });
  }
}
