import {
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  BaseEntity, Column, Generated, PrimaryGeneratedColumn, Index,
} from 'typeorm';

export class BaseDataEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Index('create_at_index')
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Index('uuid_index')
  @Column({ name: 'uuid' })
  @Generated("uuid")
  uuid: string;

}

export default BaseDataEntity;