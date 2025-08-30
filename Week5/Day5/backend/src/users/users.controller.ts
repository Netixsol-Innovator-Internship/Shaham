import { Controller, Get, Param, UseGuards, Request, Patch, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../utils/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) return { error: 'Not found' };
    const obj = user.toObject();
    delete obj.password;
    return obj;
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) return { error: 'Not found' };
    const obj = user.toObject();
    delete obj.password;
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Request() req: any, @Body() body: any) {
    const updated = await this.usersService.updateProfile(req.user.userId, body);
    if (!updated) return { error: 'Not found' };
    const obj = updated.toObject();
    delete obj.password;
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('wishlist/:carId')
  async addToWishlist(@Request() req: any, @Param('carId') carId: string) {
    const user = await this.usersService.addToWishlist(req.user.userId, carId);
    return user.wishlist;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('wishlist/:carId')
  async removeFromWishlist(@Request() req: any, @Param('carId') carId: string) {
    const user = await this.usersService.removeFromWishlist(req.user.userId, carId);
    return user.wishlist;
  }

  @UseGuards(JwtAuthGuard)
  @Get('wishlist/me')
  async getWishlist(@Request() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) return { error: 'Not found' };
    await user.populate('wishlist');
    return user.wishlist;
  }
}
