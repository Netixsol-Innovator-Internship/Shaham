import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'changeme',
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Validating payload:', {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role
    });

    // Verify user still exists and is active
    const user = await this.userModel.findById(payload.sub);
    if (!user) {
      console.log('JWT Strategy - User not found:', payload.sub);
      throw new UnauthorizedException('User not found');
    }
    
    if (user.blocked) {
      console.log('JWT Strategy - User blocked:', payload.sub);
      throw new UnauthorizedException('User blocked');
    }

    if (!user.verified) {
      console.log('JWT Strategy - User not verified:', payload.sub);
      throw new UnauthorizedException('User not verified');
    }

    console.log('JWT Strategy - User validated successfully:', {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    return { 
      id: user._id.toString(), 
      email: user.email, 
      name: user.name, 
      role: user.role 
    };
  }
}
