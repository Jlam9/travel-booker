import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Destination } from "src/model/destination/destination.entity";
import { plainToInstance } from "class-transformer";
import { CustomError } from "src/config/exception/custom.error";
import { MessageCodes } from "src/config/exception/internal-message-code";
import { DestinationCreateRequest } from "src/dto/destination/destination-create-request.dto";
import { DestinationResponse } from "src/dto/destination/destination-response.dto";
import { DestinationSearchRequest } from "src/dto/destination/destination-search-request-dto";
import { createPage } from "src/dto/common/page";
import { DestinationUpdateRequest } from "src/dto/destination/destination-update-request.dto";
import { Booking } from "src/model/booking/booking.entity";
import { BookingStatusType } from "src/type/booking/booking-status.type";

@Injectable()
export class DestinationService {

  constructor(
    @InjectRepository(Destination)
    private readonly destinationRepo: Repository<Destination>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) { }

  async createDestination(data: DestinationCreateRequest) {

    const { name, country, city } = data;

    // Validar duplicado exacto (name + city + country)
    const existing = await this.destinationRepo.findOne({
      where: { name, city, country }
    });

    if (existing) {
      throw new CustomError(MessageCodes.DestinationAlreadyExists, {
        details: `${name}, ${city}, ${country}`
      });
    }

    const destination = this.destinationRepo.create({
      name,
      country,
      city,
      isActive: true, // siempre activo al crear
    });

    const saved = await this.destinationRepo.save(destination);

    return plainToInstance(DestinationResponse, saved, {
      excludeExtraneousValues: true
    });
  }

  async searchDestinations(query: DestinationSearchRequest) {
    const { page, size, country, city, isActive } = query;

    const qb = this.destinationRepo
      .createQueryBuilder('d')
      .orderBy('d.id', 'DESC');

    if (country) {
      qb.andWhere('d.country ILIKE :country', { country: `%${country}%` });
    }

    if (city) {
      qb.andWhere('d.city ILIKE :city', { city: `%${city}%` });
    }

    if (isActive !== undefined) {
      qb.andWhere('d.isActive = :active', { active: isActive === 'true' });
    }

    qb.skip(page * size).take(size);

    const [destinations, total] = await qb.getManyAndCount();

    const result = plainToInstance(DestinationResponse, destinations, {
      excludeExtraneousValues: true
    });

    return createPage(result, page, size, total);
  }

  async getDestinationById(id: number) {

    const destination = await this.destinationRepo.findOne({
      where: { id }
    });

    if (!destination) {
      throw new CustomError(MessageCodes.DestinationNotFound, { id });
    }

    return plainToInstance(DestinationResponse, destination, {
      excludeExtraneousValues: true
    });
  }

  async updateDestination(id: number, data: DestinationUpdateRequest) {

    const { name, country, city, isActive } = data;

    const destination = await this.destinationRepo.findOne({ where: { id } });

    if (!destination) {
      throw new CustomError(MessageCodes.DestinationNotFound, { id });
    }

    // Validar duplicados
    if (name || country || city) {
      const duplicate = await this.destinationRepo.findOne({
        where: {
          name: name ?? destination.name,
          city: city ?? destination.city,
          country: country ?? destination.country
        }
      });

      if (duplicate && duplicate.id !== id) {
        throw new CustomError(MessageCodes.DestinationAlreadyExists, {
          details: `${name ?? destination.name}, ${city ?? destination.city}, ${country ?? destination.country}`
        });
      }
    }

    if (name !== undefined) destination.name = name.trim();
    if (country !== undefined) destination.country = country.trim();
    if (city !== undefined) destination.city = city.trim();
    if (isActive !== undefined) destination.isActive = isActive;

    const updated = await this.destinationRepo.save(destination);

    return plainToInstance(DestinationResponse, updated, {
      excludeExtraneousValues: true
    });
  }

  async deleteDestination(id: number) {

    const destination = await this.destinationRepo.findOne({
      where: { id },
    });

    if (!destination) {
      throw new CustomError(MessageCodes.DestinationNotFound, { id });
    }

    // Tomamos "Bookings Activos" como todos aquellos que no esten cancelados
    const activeBookings = await this.bookingRepo.count({
      where: {
        destination: { id },
        status: Not(BookingStatusType.Cancelled)
      }
    });

    if (activeBookings > 0) {
      throw new CustomError(MessageCodes.DestinationHasActiveBookings, { id });
    }

    // Soft delete
    destination.isActive = false;

    const updated = await this.destinationRepo.save(destination);

    return plainToInstance(DestinationResponse, updated, {
      excludeExtraneousValues: true
    });
  }

}
