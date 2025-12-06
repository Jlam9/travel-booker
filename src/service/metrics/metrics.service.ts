import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";

import { User } from "src/model/account/user.entity";
import { Destination } from "src/model/destination/destination.entity";
import { Booking } from "src/model/booking/booking.entity";
import { BookingStatusType } from "src/type/booking/booking-status.type";

@Injectable()
export class MetricsService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Destination)
    private readonly destinationRepo: Repository<Destination>,

    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    private readonly dataSource: DataSource
  ) {}

  async getMetrics() {

    // Métricas de negocio
    const totalUsers = await this.userRepo.count();
    const activeDestinations = await this.destinationRepo.count({ where: { isActive: true } });

    const totalBookings = await this.bookingRepo.count();
    const pendingBookings = await this.bookingRepo.count({ where: { status: BookingStatusType.Pending } });
    const confirmedBookings = await this.bookingRepo.count({ where: { status: BookingStatusType.Confirmed } });
    const cancelledBookings = await this.bookingRepo.count({ where: { status: BookingStatusType.Cancelled } });

    // Métricas del sistema
    const memoryUsed = process.memoryUsage().rss;
    const uptimeMs = process.uptime() * 1000;

    // Estado DB
    let dbStatus = "up";
    try {
      await this.dataSource.query("SELECT 1");
    } catch {
      dbStatus = "down";
    }

    return {
      totalUsers,
      activeDestinations,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      memoryUsed,
      uptimeMs,
      databaseStatus: dbStatus
    };
  }
}
