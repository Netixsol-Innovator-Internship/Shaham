import { Body, Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { text: string; authorId: string },
  ) {
    const updated = await this.commentsService.update(id, body.authorId, body.text);
    this.gateway.emitUpdatedComment(updated);
    return updated;
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Body() body: { authorId: string },
  ) {
    const deleted = await this.commentsService.delete(id, body.authorId);
    this.gateway.emitDeletedComment(deleted._id);
    return deleted;
  }
}
