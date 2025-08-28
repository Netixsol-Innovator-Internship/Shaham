import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import serverlessExpress from '@vendia/serverless-express';

let cachedServer: any;

async function createApp() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());

  const origin = process.env.CLIENT_ORIGIN || 'http://localhost:3001';
  app.enableCors({
    origin,
    credentials: true,
  });

  await app.init();
  return app;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());

  const origin = process.env.CLIENT_ORIGIN || 'http://localhost:3001';
  app.enableCors({
    origin,
    credentials: true,
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

if (!process.env.VERCEL) {
  bootstrap();
}

export const handler = async (event, context) => {
  if (!cachedServer) {
    const app = await createApp();
    const expressInstance = app.getHttpAdapter().getInstance();
    cachedServer = serverlessExpress({ app: expressInstance });
  }
  return cachedServer(event, context);
};
