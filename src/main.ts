import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './RedisAdapter/redis-io.adapter';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',  
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe())

  app.use(cookieParser())

  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();
  // app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
