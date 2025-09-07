import { Controller, Get, Post, Body, UseGuards, Request, Param, Delete, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
export class CartController {
  constructor(private cart: CartService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async myCart(@Request() req) {
    console.log('=== CART GET DEBUG ===');
    console.log('Headers:', req.headers.authorization);
    console.log('User from JWT:', req.user);
    console.log('User ID:', req.user?.id);
    console.log('=====================');
    
    if (!req.user) {
      console.log('ERROR: No user found in request - JWT authentication failed');
      throw new Error('Authentication failed');
    }
    
    const result = await this.cart.getForUser(req.user.id);
    console.log('Cart result:', result);
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async add(@Request() req, @Body() body: any) {
    return this.cart.addItem(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove/:productId')
  async remove(@Request() req, @Param('productId') productId: string, @Body() body: any) {
    return this.cart.removeItem(req.user.id, productId, body.variantId, body.sizeStockId, body.purchaseMethod);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:productId')
  async update(@Request() req, @Param('productId') productId: string, @Body() body: any) {
    console.log('=== CART UPDATE DEBUG ===');
    console.log('User ID:', req.user.id);
    console.log('Product ID:', productId);
    console.log('Request Body:', body);
    console.log('========================');
    
    const result = await this.cart.updateQty(
      req.user.id,
      productId,
      body.variantId,
      body.sizeStockId,
      body.purchaseMethod,
      body.qty
    );
    
    console.log('Cart update result:', result);
    return result;
  }
}
