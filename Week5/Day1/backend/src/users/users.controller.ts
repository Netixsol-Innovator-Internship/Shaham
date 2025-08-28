import { Controller, Get, Patch, Body, UseGuards, Param, Post, Delete, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@CurrentUser() user, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user._id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  follow(@CurrentUser() user, @Param('id') id: string) {
    return this.usersService.follow(user._id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  unfollow(@CurrentUser() user, @Param('id') id: string) {
    return this.usersService.unfollow(user._id, id);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
