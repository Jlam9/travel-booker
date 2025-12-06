import './polyfills';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedRBAC } from './seed/rcab.seed';

function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Travel Booker API')
    .setDescription('Travel Booker API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
}
const logger = new Logger('Bootstrap');
initializeTransactionalContext();

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new LoggingInterceptor()); 

  await app.init();

  try {
    const dataSource = app.get(DataSource);
    logger.log('Ejecutando seed RBAC al iniciar la aplicacion...');
    await seedRBAC(dataSource);
  } catch (error) {
    logger.error('Fallo el seed RBAC al iniciar la aplicacion', error as Error);
    throw error;
  }

  const document = SwaggerModule.createDocument(app, getSwaggerConfig());
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
