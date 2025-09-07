import { Controller, Post, Get, Body, UseGuards, Put, Delete, Param, Req } from '@nestjs/common';
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
  async create(@Body() body: any, @Req() req: any) {
    return this.sales.create(body, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','super_admin')
  @Get('list')
  async listAll() {
    return this.sales.list();
  }

  @Get('active')
  async getActiveSales() {
    return this.sales.getActiveSales();
  }

  @Get('current')
  async getCurrentSale() {
    return this.sales.getCurrentSale();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','super_admin')
  @Get(':id')
  async getSaleById(@Param('id') id: string) {
    return this.sales.getSaleById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','super_admin')
  @Put(':id')
  async updateSale(@Param('id') id: string, @Body() body: any) {
    return this.sales.updateSale(id, body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','super_admin')
  @Delete(':id')
  async deleteSale(@Param('id') id: string) {
    return this.sales.deleteSale(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','super_admin')
  @Put(':id/end')
  async endSale(@Param('id') id: string) {
    return this.sales.endSale(id);
  }
}
