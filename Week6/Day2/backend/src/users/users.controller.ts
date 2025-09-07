import { Controller, Get, UseGuards, Request, Param, Post, Body, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Request() req) {
    return this.users.findById(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('points-balance')
  async getPointsBalance(@Request() req) {
    const balance = await this.users.getUserPointsBalance(req.user.id);
    return { loyaltyPoints: balance };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin')
  @Post('admin/set-role/:id')
  async setRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.users.setRole(id, body.role);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','super_admin')
  @Post('admin/block/:id')
  async block(@Param('id') id: string, @Body() body: { block: boolean }) {
    return this.users.blockUser(id, body.block);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateData: { name?: string; mobile?: string; address?: string }) {
    return this.users.updateProfile(req.user.id, updateData);
  }
}
