import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api'); // Set global prefix for all routes

  app.useGlobalFilters(new HttpExceptionFilter());

  //swagger setup
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('Complete API documentation for the NestJS application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(
    `Swagger documentation is available at: http://localhost:${port}/api/docs`,
  );
}
bootstrap();
