import { Controller, Post, UseGuards, Request, Body, Get, Param } from '@nestjs/common';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from '../utils/jwt.guard';

@Controller('bids')
export class BidsController {
  constructor(private bidsService: BidsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':carId')
  async place(@Param('carId') carId: string, @Request() req: any, @Body() body: any) {
    const amount = Number(body.amount);
    return this.bidsService.placeBid(carId, req.user.userId, amount);
  }

  @Get('car/:carId')
  async list(@Param('carId') carId: string) {
    return this.bidsService.listForCar(carId);
  }
}
