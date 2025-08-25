import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsGateway } from './comments.gateway';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly gateway: CommentsGateway,
  ) {}

  @Get()
  async list() {
    return this.commentsService.list();
  }

  @Post()
  async create(@Body() body: { text: string; authorId: string }) {
    const { text, authorId } = body || {};
    if (!text || !authorId) {
      return { error: 'text and authorId are required' };
    }
    const created = await this.commentsService.create({ text, authorId });
    this.gateway.emitNewComment(created);
    return created;
  }
}
