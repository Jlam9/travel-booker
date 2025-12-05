import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const utilEntities = [];

export const entities = [
  ...utilEntities
];

export function getPgDbConfig(): TypeOrmModuleOptions {
  const options: TypeOrmModuleOptions = {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: entities,
    subscribers: [],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    namingStrategy: new SnakeNamingStrategy(),
  };

  return options;
}
