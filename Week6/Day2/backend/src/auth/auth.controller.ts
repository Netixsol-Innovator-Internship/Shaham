import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.auth.register(body);
  }

  @Post('resend-otp')
  async resend(@Body() body: { email: string }) {
    return this.auth.resendOtp(body.email);
  }

  @Post('verify-otp')
  async verify(@Body() body: { email: string; otp: string }) {
    return this.auth.verifyOtp(body.email, body.otp);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.auth.login(body);
  }

  @Post('logout')
  async logout() {
    return { message: 'Logged out successfully' };
  }
}
