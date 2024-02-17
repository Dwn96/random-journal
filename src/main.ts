import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('cert.key'),
    cert: fs.readFileSync('cert.crt'),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  })
  await app.listen(3665);
}
bootstrap();
