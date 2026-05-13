import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './core/utils/filters/global-exception.filter';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // app.useGlobalFilters(new GlobalExceptionFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formatted: Record<string, any> = {};

        const formatErrors = (errorsArray, parent = '') => {
          errorsArray.forEach((error) => {
            const field = parent
              ? `${parent}.${error.property}`
              : error.property;

            if (error.constraints) {
              formatted[field] = Object.values(error.constraints)[0];
            }

            if (error.children?.length) {
              formatErrors(error.children, field);
            }
          });
        };

        formatErrors(errors);

        throw new BadRequestException(formatted);
      },
    }),
  );

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
