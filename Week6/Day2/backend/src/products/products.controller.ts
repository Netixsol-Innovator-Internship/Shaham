import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async list(@Query() query: any) {
    return this.productsService.list(query);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.productsService.findById(id);
  }
}
