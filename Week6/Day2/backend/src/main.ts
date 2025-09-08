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
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Enable HTTP CORS
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configure Socket.IO adapter with CORS for frontend
  const ioAdapter = new IoAdapter(app);
  ioAdapter.createIOServer = (port: number, options?: any) => {
    const corsOptions = {
      origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3001',
      methods: ['GET', 'POST'],
      credentials: true,
    };
    const server = require('socket.io')(port, { ...options, cors: corsOptions });
    return server;
  };
  app.useWebSocketAdapter(ioAdapter);

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Server started on http://localhost:${port}`);
  console.log(`WebSocket server ready for Socket.IO connections`);
}
bootstrap();
