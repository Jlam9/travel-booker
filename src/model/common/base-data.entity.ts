import {
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  BaseEntity, Column, Generated, PrimaryGeneratedColumn, Index,
} from 'typeorm';

export class BaseDataEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({ name: 'uuid' })
  @Generated("uuid")
  uuid: string;

}

export default BaseDataEntity;