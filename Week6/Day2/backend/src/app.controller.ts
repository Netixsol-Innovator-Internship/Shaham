import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealthCheck(): { status: string; message: string } {
    return {
      status: 'healthy',
      message: 'Server is running',
    };
  }
}
