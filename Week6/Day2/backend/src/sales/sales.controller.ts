import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('admin/sales')
export class SalesController {
  constructor(private sales: SalesService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','super_admin')
  @Post('create')
  async create(@Body() body: any) {
    return this.sales.create(body);
  }

  @Get('list')
  async listAll() {
    return this.sales.list();
  }
}
