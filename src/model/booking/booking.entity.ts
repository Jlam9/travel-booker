// src/models/booking/booking.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import BaseDataEntity from '../common/base-data.entity';
import { User } from '../account/user.entity';
import { BookingStatusType } from 'src/type/booking/booking-status.type';
import { Destination } from '../destination/destination.entity';

@Entity('bookings')
export class Booking extends BaseDataEntity {

  @Column({ type: 'varchar', length: 150 })
  customerName: string;

  @Column({ type: 'varchar', length: 150 })
  customerEmail: string;

  @ManyToOne(() => Destination, dest => dest.bookings)
  @JoinColumn({ name: 'destination_id' })
  destination: Destination;

  @Column({
    type: 'enum',
    enum: BookingStatusType,
    default: BookingStatusType.Pending,
  })
  status: BookingStatusType;

  @Column({ type: 'timestamp', name: 'travel_date' })
  travelDate: Date;

  @ManyToOne(() => User, user => user.bookingsCreated)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;
}
