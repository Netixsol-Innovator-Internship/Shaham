import { Controller, Get, UseGuards, Request, Patch, Param } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { JwtAuthGuard } from '../utils/jwt.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Request() req: any) {
    return this.notificationService.listForUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async mark(@Param('id') id: string) {
    return this.notificationService.markRead(id);
  }
}
