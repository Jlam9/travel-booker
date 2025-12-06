import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";

import { Booking } from "src/model/booking/booking.entity";
import { Destination } from "src/model/destination/destination.entity";
import { User } from "src/model/account/user.entity";



import { BookingResponse } from "src/dto/booking/booking-response.dto";

import { MessageCodes } from "src/config/exception/internal-message-code";
import { CustomError } from "src/config/exception/custom.error";

import { BookingStatusType } from "src/type/booking/booking-status.type";
import { plainToInstance } from "class-transformer";
import { BookingCreateRequest } from "src/dto/booking/booking-create-request.dto";
import { createPage } from "src/dto/common/page";
import { BookingSearchRequest } from "src/dto/booking/booking-search-request.dto";
import { BookingUpdateRequest } from "src/dto/booking/booking-update-request.dto";

@Injectable()
export class BookingService {

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(Destination)
    private readonly destinationRepo: Repository<Destination>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async createBooking(data: BookingCreateRequest, userEmail: string) {

    const { customerName, customerEmail, destinationId, travelDate } = data;

    // Validar destino
    const destination = await this.destinationRepo.findOne({ where: { id: destinationId } });

    if (!destination) {
      throw new CustomError(MessageCodes.DestinationNotFound, { id: destinationId });
    }

    if (!destination.isActive) {
      throw new CustomError(MessageCodes.DestinationInactive, { id: destinationId });
    }

    // Validar usuario creador
    const user = await this.userRepo.findOne({ where: { email: userEmail } });

    if (!user) {
      throw new CustomError(MessageCodes.UserNotFound, { email: userEmail });
    }

    const booking = this.bookingRepo.create({
      customerName,
      customerEmail,
      destination,
      travelDate: new Date(travelDate),
      createdByUser: user,
      status: BookingStatusType.Pending
    });

    const saved = await this.bookingRepo.save(booking);

    const flattened = {
      id: saved.id,
      customerName: saved.customerName,
      customerEmail: saved.customerEmail,
      destinationId: saved.destination.id,
      status: saved.status,
      travelDate: saved.travelDate,
      createdByUserId: saved.createdByUser.id
    };

    return plainToInstance(BookingResponse, flattened, {
      excludeExtraneousValues: true
    });
  }

  async searchBookings(query: BookingSearchRequest) {

    const { page, size, status, destinationId, fromDate, toDate } = query;

    const qb: SelectQueryBuilder<Booking> = this.bookingRepo
      .createQueryBuilder("b")
      .leftJoinAndSelect("b.destination", "d")
      .leftJoinAndSelect("b.createdByUser", "u")
      .orderBy("b.id", "DESC");

    if (status) {
      qb.andWhere("b.status = :status", { status });
    }

    if (destinationId) {
      qb.andWhere("b.destination = :destId", { destId: destinationId });
    }

    if (fromDate) {
      qb.andWhere("b.travelDate >= :from", { from: new Date(fromDate) });
    }

    if (toDate) {
      qb.andWhere("b.travelDate <= :to", { to: new Date(toDate) });
    }

    qb.skip(page * size).take(size);

    const [result, total] = await qb.getManyAndCount();

    const mapped = result.map(b => ({
      id: b.id,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      destinationId: b.destination.id,
      status: b.status,
      travelDate: b.travelDate,
      createdByUserId: b.createdByUser.id
    }));

    const dtoList = plainToInstance(BookingResponse, mapped, {
      excludeExtraneousValues: true,
    });

    return createPage(dtoList, page, size, total);
  }

  async getBookingById(id: number) {

    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ["destination", "createdByUser"]
    });

    if (!booking) {
      throw new CustomError(MessageCodes.BookingNotFound, { id });
    }

    const flattened = {
      id: booking.id,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      destinationId: booking.destination.id,
      status: booking.status,
      travelDate: booking.travelDate,
      createdByUserId: booking.createdByUser.id
    };

    return plainToInstance(BookingResponse, flattened, {
      excludeExtraneousValues: true
    });
  }

  async updateBooking(id: number, data: BookingUpdateRequest) {

    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ["destination", "createdByUser"]
    });

    if (!booking) {
      throw new CustomError(MessageCodes.BookingNotFound, { id });
    }

    const { status } = data;

    booking.status = status;

    const saved = await this.bookingRepo.save(booking);

    const flattened = {
      id: saved.id,
      customerName: saved.customerName,
      customerEmail: saved.customerEmail,
      destinationId: saved.destination.id,
      status: saved.status,
      travelDate: saved.travelDate,
      createdByUserId: saved.createdByUser.id
    };

    return plainToInstance(BookingResponse, flattened, {
      excludeExtraneousValues: true
    });
  }

  async deleteBooking(id: number) {

    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ["destination", "createdByUser"]
    });

    if (!booking) {
      throw new CustomError(MessageCodes.BookingNotFound, { id });
    }

    await this.bookingRepo.remove(booking);

    return {
      message: `Booking ${id} deleted`,
      id
    };
  }
}
