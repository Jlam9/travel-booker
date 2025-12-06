import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Permission } from 'src/model/account/permission.entity';
import { RolePermission } from 'src/model/account/role-permission.entity';
import { Role } from 'src/model/account/role.entity';
import { UserRole } from 'src/model/account/user-role.entity';
import { User } from 'src/model/account/user.entity';
import { Booking } from 'src/model/booking/booking.entity';
import { Destination } from 'src/model/destination/destination.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const accountEntities = [Permission, RolePermission, UserRole, User, Role];
export const bookingEntities = [Booking]
export const destinationEntities = [Destination]

export const entities = [
  ...accountEntities,
  ...bookingEntities,
  ...destinationEntities
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
