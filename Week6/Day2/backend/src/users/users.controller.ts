import { Controller, Get, UseGuards, Request, Param, Post, Body, Put, Patch } from '@nestjs/common';
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
    console.log('Getting user profile for ID:', req.user.id);
    const user = await this.users.findById(req.user.id);
    console.log('User profile data:', user);
    return user;
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

  // Temporary endpoint to make current user super_admin (for testing)
  @UseGuards(AuthGuard('jwt'))
  @Post('make-me-super-admin')
  async makeMeSuperAdmin(@Request() req) {
    console.log('Making user super admin:', req.user.id);
    const result = await this.users.setRole(req.user.id, 'super_admin');
    console.log('Updated user:', result);
    return result;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin')
  @Put('admin/:id/block')
  async blockUser(@Param('id') id: string, @Body() body: any) {
    return this.users.blockUser(id, body.block);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  async updateProfile(@Request() req, @Body() body: { name?: string; mobile?: string; address?: string }) {
    const { name, mobile, address } = body;
    return this.users.updateProfile(req.user.id, { name, mobile, address });
  }

  // Super Admin endpoints
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin')
  @Get('admin/all')
  async getAllUsers() {
    return this.users.getAllUsers();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin')
  @Patch('admin/:id/role')
  async updateUserRole(@Param('id') id: string, @Body() body: { role: string }) {
    const { role } = body;
    return this.users.updateUserRole(id, role);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin')
  @Patch('admin/:id/block')
  async updateUserBlockStatus(@Param('id') id: string, @Body() body: { isBlocked: boolean }) {
    const { isBlocked } = body;
    return this.users.updateUserBlockStatus(id, isBlocked);
  }
}
