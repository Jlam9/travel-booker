import { Entity, Column, OneToMany } from 'typeorm';
import BaseDataEntity from '../common/base-data.entity';
import { UserRole } from './user-role.entity';
import { RolePermission } from './role-permission.entity';

@Entity('roles')
export class Role extends BaseDataEntity {

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @OneToMany(() => UserRole, ur => ur.role)
  userRoles: UserRole[];

  @OneToMany(() => RolePermission, rp => rp.role)
  rolePermissions: RolePermission[];
}
