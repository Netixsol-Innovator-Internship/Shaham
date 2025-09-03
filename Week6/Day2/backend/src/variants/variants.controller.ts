import { Controller, Get, Param } from '@nestjs/common';
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
}
