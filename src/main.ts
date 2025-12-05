import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Travel Booker API')
    .setDescription('Travel Booker API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
}

async function bootstrap() {

  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const document = SwaggerModule.createDocument(app, getSwaggerConfig());
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  await app.listen(process.env.PORT || 3005);
}
bootstrap();
