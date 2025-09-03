import { Controller, Get, UseGuards, Request, Post, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async my(@Request() req) {
    return this.notifications.listForUser(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('mark-read/:id')
  async mark(@Param('id') id: string) {
    return this.notifications.markRead(id);
  }
}
