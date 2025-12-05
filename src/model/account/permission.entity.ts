import { Entity, Column, OneToMany } from 'typeorm';
import BaseDataEntity from '../common/base-data.entity';
import { RolePermission } from './role-permission.entity';

@Entity('permissions')
export class Permission extends BaseDataEntity {

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @OneToMany(() => RolePermission, rp => rp.permission)
  rolePermissions: RolePermission[];
}
