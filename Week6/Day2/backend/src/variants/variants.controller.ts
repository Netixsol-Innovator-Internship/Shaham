import { Controller, Get, Param, Post, Body, UseGuards, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { VariantsService } from './variants.service';

@Controller('variants')
export class VariantsController {
  constructor(private variants: VariantsService) {}

  @Get('product/:productId')
  async listForProduct(@Param('productId') productId: string) {
    return this.variants.listByProduct(productId);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.variants.findById(id);
  }

  // Admin endpoint to create variant
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'super_admin')
  @Post('admin/create/:productId')
  async createVariant(@Param('productId') productId: string, @Body() variantData: any) {
    console.log('VariantsController.createVariant called with:', { productId, variantData });
    const result = await this.variants.create(productId, variantData);
    console.log('VariantsController.createVariant result:', result);
    return result;
  }

  // Admin endpoint to update variant
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'super_admin')
  @Put('admin/:id')
  async updateVariant(@Param('id') id: string, @Body() variantData: any) {
    console.log('VariantsController.updateVariant called with:', { id, variantData });
    const result = await this.variants.update(id, variantData);
    console.log('VariantsController.updateVariant result:', result);
    return result;
  }
}
