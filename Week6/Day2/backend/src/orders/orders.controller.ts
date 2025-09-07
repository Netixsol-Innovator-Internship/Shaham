import { Controller, Post, UseGuards, Request, Body, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}


  @UseGuards(AuthGuard('jwt'))
  @Post('checkout')
  async checkout(@Request() req, @Body() body: any) {
    return this.orders.checkout(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async myOrders(@Request() req) {
    return this.orders.listForUser(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.orders.getById(id);
  }
}
