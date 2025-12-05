import { Entity, Column, OneToMany, Index } from 'typeorm';
import BaseDataEntity from '../common/base-data.entity';
import { UserRole } from './user-role.entity';
import { UserStatusType } from 'src/type/account/user-status.type';
import { Booking } from '../booking/booking.entity';

@Entity('users')
export class User extends BaseDataEntity {

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserStatusType,
    default: UserStatusType.Active,
  })
  status: UserStatusType;

  @OneToMany(() => UserRole, ur => ur.user)
  userRoles: UserRole[];

  @OneToMany(() => Booking, b => b.createdByUser)
  bookingsCreated: Booking[];
}
