import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiGatewayModule } from './api-gateway.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // ─── Security: Helmet ────────────────────────────────────────────────────────
  app.use(helmet());

  // ─── Global Exception Filter (phải đăng ký trước pipes) ─────────────────────
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ─── Global Validation Pipe ──────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ─── CORS ────────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: '*', // TODO: restrict in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ─── Global Prefix ───────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ─── Swagger API Documentation ───────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('S.Budget API')
    .setDescription('The S.Budget microservices API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env['API_GATEWAY_PORT'] || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 API Gateway is running on port ${port}`);
  console.log(
    `📚 Swagger documentation is available at http://localhost:${port}/api/docs`,
  );
}
bootstrap();
