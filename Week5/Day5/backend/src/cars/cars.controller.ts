import { 
  Controller, Post, Body, UseGuards, Request, Get, Query, Param, Patch, Delete 
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../utils/jwt.guard';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return this.carsService.create(body, req.user.userId);
  }

  @Get()
  async list(@Query() query: any) {
    return this.carsService.list(query);
  }

  @Get('auctions')
  async listActiveAuctions() {
    return this.carsService.listActiveAuctions();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.carsService.get(id);
  }

  @Get(':id/bids')
  async listBids(@Param('id') id: string) {
    return this.carsService.listBids(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/start')
  async startAuction(@Param('id') id: string, @Request() req: any) {
    return this.carsService.startAuction(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.carsService.updateCar(id, body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.carsService.removeCar(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/end')
  async end(@Param('id') id: string, @Request() req: any) {
    return this.carsService.endAuction(id, req.user.userId);
  }
}
