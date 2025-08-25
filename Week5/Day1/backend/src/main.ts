import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const origins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map(s => s.trim());
  app.enableCors({ origin: origins, credentials: true });

  await app.listen(process.env.PORT ? parseInt(process.env.PORT, 10) : 5000);
}
bootstrap();
