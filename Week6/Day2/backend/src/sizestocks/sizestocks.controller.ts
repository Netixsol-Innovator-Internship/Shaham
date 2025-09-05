import { Controller, Post, Body, UseGuards, Param, Patch, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SizeStockService } from './sizestocks.service';

@Controller('admin/sizes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin', 'super_admin')
export class SizeStockController {
  constructor(private sizes: SizeStockService) { }

  @Post(':variantId')
  async create(@Param('variantId') variantId: string, @Body() body: { size: string; stock: number }) {
    return this.sizes.create(variantId, body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: Partial<{ size: string; stock: number }>) {
    return this.sizes.update(id, body);
  }

  @Get('variant/:variantId')
  async listForVariant(@Param('variantId') variantId: string) {
    return this.sizes.listByVariant(variantId);
  }
}

@Controller('sizes')
export class PublicSizeStockController {
  constructor(private sizes: SizeStockService) { }

  @Get('variant/:variantId')
  async listForVariant(@Param('variantId') variantId: string) {
    return this.sizes.listByVariant(variantId);
  }
}