import { Controller, Get, Query, Param, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

  // lookup by slug (friendly URLs in frontend often use slug)
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  // allow ANY user to post a review for product (no auth required)
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/reviews')
  async addReview(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    console.log('=== ADD REVIEW DEBUG ===');
    console.log('Headers:', req.headers);
    console.log('Authorization:', req.headers.authorization);
    console.log('Add Review - User:', req.user);
    console.log('Add Review - Body:', body);
    console.log('========================');
    
    if (!req.user) {
      console.log('ERROR: No user found in request - JWT authentication failed');
      throw new Error('Authentication failed');
    }
    
    return this.productsService.addReview(id, body, req.user);
  }
}
