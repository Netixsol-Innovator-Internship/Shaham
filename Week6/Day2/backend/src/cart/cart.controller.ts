import { Controller, Get, Post, Body, UseGuards, Request, Param, Delete, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
export class CartController {
  constructor(private cart: CartService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async myCart(@Request() req) {
    return this.cart.getForUser(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async add(@Request() req, @Body() body: any) {
    return this.cart.addItem(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove/:productId')
  async remove(@Request() req, @Param('productId') productId: string) {
    return this.cart.removeItem(req.user.id, productId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:productId')
  async update(@Request() req, @Param('productId') productId: string, @Body() body: { qty:number }) {
    return this.cart.updateQty(req.user.id, productId, body.qty);
  }
}
