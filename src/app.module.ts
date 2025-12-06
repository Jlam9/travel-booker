import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { entities, getPgDbConfig } from './config/db/db.config';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { JwtModule } from '@nestjs/jwt';
import { Controllers } from './config/module/controllers';
import { Services } from './config/module/services';

@Module({
  imports: [
    ...configImports(),
    ...jwtImports(),
    ...typeOrmImports(),
  ],
  controllers: [
    ...Controllers.AccountControllers,
    ...Controllers.AuthControllers,
    ...Controllers.BookingControllers,
    ...Controllers.DestinationControllers,
    ...Controllers.UtilControllers
  ],
  providers: [
    ...Services.AccountServices,
    ...Services.AuthServices,
    ...Services.BookingServices,
    ...Services.DestinationServices,
    ...Services.UtilServices
  ],
  exports: [
  ],
})
export class AppModule { }

export function configImports() {
  return [
    ConfigModule.forRoot({
      envFilePath: getEnvFile(),
    }),
  ];
}

export function typeOrmImports() {
  return [
    ...getDbConfigImports(),
    // Se puede agregar más configuraciones de Base de datos
  ];
}

export function jwtImports() {
  return [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' }
    })
  ];
}

function getDbConfigImports() {
  const dbConfigImports = [
    TypeOrmModule.forRootAsync({
      name: 'default',
      useFactory() {
        return getPgDbConfig();
      },
      async dataSourceFactory(options) {
        if (!options) throw new Error('Invalid options passed');
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    TypeOrmModule.forFeature([
      ...entities
    ]),
  ];

  return dbConfigImports;
}

export function getEnvFile(): string | string[] {
  const env = process.env.NODE_ENV ?? 'local-dev';
  return [
    `environment/.env.${env}`,
    'environment/.env',
  ];
}
