import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IdempotencyGuard } from './common/idempotency.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Parse allowed CORS origins from environment
  const envOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:19006'];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Allow mobile apps / curl / server-to-server calls with undefined origin
      if (!origin || envOrigins.includes('*') || envOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Dev fallback
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  app.useGlobalGuards(new IdempotencyGuard());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Masik Bazar Enterprise API')
    .setDescription('Household Grocery Operating System API — Full Scope Enterprise Build with Security Hardening')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Masik Bazar Backend API running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger Documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
