import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { seedRBAC } from './rcab.seed';

async function run() {
  // Necesario para typeorm-transactional
  initializeTransactionalContext();

  const app = await NestFactory.createApplicationContext(AppModule);

  // Inicializar Nest completamente
  await app.init();

  const dataSource = app.get(DataSource);

  console.log('Ejecutando seed RBAC...');
  await seedRBAC(dataSource);

  await app.close();
  console.log('Seed completado y aplicacion cerrada.');
}

run().catch(err => {
  console.error('Error ejecutando seed:', err);
  process.exit(1);
});
