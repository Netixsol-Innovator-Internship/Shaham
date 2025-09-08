import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schemas/user.schema';
import { MailService } from '../utils/mail.service';
import { emitRealtime } from '../realtime/realtime.util';

function genOTP(len = 6) {
  const digits = '0123456789';
  let s = '';
  for (let i = 0; i < len; i++) {
    s += digits[Math.floor(Math.random() * digits.length)];
  }
  return s;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mail: MailService,
  ) { }

  async register(data: { name: string; email: string; password: string }) {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) throw new BadRequestException('Email already registered');

    const hash = await bcrypt.hash(data.password, 10);
    const otp = genOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const created = await this.userModel.create({
      name: data.name,
      email: data.email,
      passwordHash: hash,
      role: 'user',
      loyaltyPoints: 0,
      otp,
      otpExpiresAt,
      verified: false,
      blocked: false,
    });

    // ✅ Send OTP email to user
    await this.mail.sendMail(
      data.email,
      'Verify your account',
      `Your OTP: ${otp}. It expires in 5 minutes.`,
    );

    // Emit admin dashboard event for new user registration
    emitRealtime('admin:new_user_registered', {
      userId: created._id,
      name: created.name,
      email: created.email,
      registeredAt: new Date(),
      verified: false
    }, 'admins');

    return { message: 'Registered. Verify OTP sent to email.' };
  }

  async resendOtp(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');
    if (user.verified) throw new BadRequestException('Already verified');

    const now = new Date();
    if (
      user.otpRequestedAt &&
      now.getTime() - new Date(user.otpRequestedAt).getTime() < 60 * 1000
    ) {
      throw new BadRequestException('OTP requested too recently');
    }

    const otp = genOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    user.otpRequestedAt = now;
    await user.save();

    // ✅ Send new OTP email
    await this.mail.sendMail(
      email,
      'Your new OTP',
      `Your OTP: ${otp}. It expires in 5 minutes.`,
    );

    return { message: 'OTP resent' };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');
    if (user.verified) return { message: 'Already verified' };
    if (!user.otp || !user.otpExpiresAt) throw new BadRequestException('No OTP requested');
    if (new Date() > new Date(user.otpExpiresAt)) throw new BadRequestException('OTP expired');
    if (String(user.otp) !== String(otp)) throw new BadRequestException('Invalid OTP');

    user.verified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return { message: 'Verified' };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.verified) throw new ForbiddenException('Email not verified. Please verify OTP.');
    if (user.isBlocked) throw new ForbiddenException('Account blocked');

    const ok = await bcrypt.compare(data.password, (user as any).passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user._id.toString(), email: user.email, name: user.name, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
      },
      accessToken: token,
    };
  }
}
