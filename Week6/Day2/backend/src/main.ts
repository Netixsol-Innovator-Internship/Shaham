import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import cookieParser from 'cookie-parser';
dotenv.config();
import { randomUUID } from 'crypto';

if (!globalThis.crypto) {
  globalThis.crypto = {
    randomUUID,
  } as unknown as Crypto;
}

async function bootstrap() {
  try {
    console.log('Starting application bootstrap...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI exists:', !!process.env.MONGO_URI);
    
    const app = await NestFactory.create(AppModule);
    console.log('NestJS application created successfully');

    app.use(cookieParser());

    // Enable HTTP CORS
    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://shahamweek6day2frontend-production.up.railway.app',
      process.env.FRONTEND_ORIGIN
    ].filter(Boolean);

    console.log('Allowed CORS origins:', allowedOrigins);

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      exposedHeaders: ['Authorization'],
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Configure Socket.IO adapter with CORS for frontend
    app.useWebSocketAdapter(new IoAdapter(app));
    console.log('Socket.IO adapter configured');

    const port = process.env.PORT || 5000;
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Server started successfully on port ${port}`);
    console.log(`✅ WebSocket server ready for Socket.IO connections`);
    console.log(`✅ Health check available at: http://localhost:${port}/health`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

bootstrap().catch(error => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});
