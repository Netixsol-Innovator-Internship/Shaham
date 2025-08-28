import { Body, Controller, Get, Param, Post, Query, UseGuards, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';
import { NotificationsGateway } from '../gateway/notifications.gateway';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService, private readonly gateway: NotificationsGateway) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() user, @Body() dto: CreateCommentDto) {
    // service already emits and returns populated comment
    const populated = await this.commentsService.create(
      user._id,
      dto.content,
      dto.parentComment,
    );

    return populated;
  }

  @Get()
  async list(@Query('parent') parent?: string) {
    return this.commentsService.list(parent);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.commentsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user) {
    const deleted = await this.commentsService.remove(id, user._id);
    this.gateway.emitToAll('comments:deleted', { commentId: id });
    return deleted;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async like(@Param('id') id: string, @CurrentUser() user) {
    const updated = await this.commentsService.like(id, user._id);
    this.gateway.emitToAll('comments:likes', { commentId: id, likes: updated.likes.length });
    return updated;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  async unlike(@Param('id') id: string, @CurrentUser() user) {
    const updated = await this.commentsService.unlike(id, user._id);
    this.gateway.emitToAll('comments:likes', { commentId: id, likes: updated.likes.length });
    return updated;
  }
}
