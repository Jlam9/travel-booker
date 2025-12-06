import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import BaseDataEntity from '../common/base-data.entity';
import { User } from './user.entity';
import { Role } from './role.entity';


@Entity('user_roles')
export class UserRole extends BaseDataEntity {

  @ManyToOne(() => User, user => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, role => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
