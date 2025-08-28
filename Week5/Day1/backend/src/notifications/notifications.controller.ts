import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  list(@CurrentUser() user) { return this.service.list(user._id); }

  @Patch(':id/read')
  markRead(@CurrentUser() user, @Param('id') id: string) { return this.service.markRead(user._id, id); }

  @Patch('read-all')
  markAllRead(@CurrentUser() user) { return this.service.markAllRead(user._id); }
}
