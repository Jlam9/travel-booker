import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {

  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // const document = SwaggerModule.createDocument(app, getSwaggerConfig());
  // SwaggerModule.setup('api', app, document, {
  //   swaggerOptions: {
  //     docExpansion: 'none',
  //   },
  // });

  await app.listen(process.env.PORT || 3005);
}
bootstrap();
