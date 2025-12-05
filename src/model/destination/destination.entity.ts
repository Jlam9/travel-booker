import { Entity, Column, OneToMany } from 'typeorm';
import BaseDataEntity from '../common/base-data.entity';
import { Booking } from '../booking/booking.entity';

@Entity('destinations')
export class Destination extends BaseDataEntity {

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Booking, b => b.destination)
  bookings: Booking[];
}
