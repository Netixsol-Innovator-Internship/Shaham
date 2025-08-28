import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { CommentsGateway } from './comments.gateway';

@Module({
  providers: [NotificationsGateway, CommentsGateway],
  exports: [NotificationsGateway, CommentsGateway],
})
export class GatewayModule {}
