import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      const { password, ...rest } = user.toObject();
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { email: user.email, id: user._id, username: user.username },
    };
  }

  async register(createUserDto: any) {
    const existing = await this.usersService.findByEmail(createUserDto.email);
    if (existing) throw new UnauthorizedException('Email already exists');
    const hashed = await bcrypt.hash(createUserDto.password, 10);
    const created = await this.usersService.create({ ...createUserDto, password: hashed });
    return this.login(created);
  }
}
