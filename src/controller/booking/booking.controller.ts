import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  ParseIntPipe,
  UseGuards,
  UseFilters
} from "@nestjs/common";

import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { PermissionGuard } from "src/guards/permission.guard";
import { Permissions } from "src/decorators/permission.decorator";

import { BookingService } from "src/service/booking/booking.service";


import { BookingResponse } from "src/dto/booking/booking-response.dto";

import { PermissionType } from "src/type/account/permission.type";
import { CustomErrorFilter } from "src/config/exception/customer-error.filter";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { BookingCreateRequest } from "src/dto/booking/booking-create-request.dto";
import { Page } from "src/dto/common/page";
import { BookingUpdateRequest } from "src/dto/booking/booking-update-request.dto";
import { BookingSearchRequest } from "src/dto/booking/booking-search-request.dto";

@ApiTags("Bookings")
@UseGuards(JwtAuthGuard, PermissionGuard)
@UseFilters(new CustomErrorFilter())
@Controller("/bookings")
export class BookingsController {

  constructor(private readonly bookingService: BookingService) { }

  @Post()
  @Permissions(PermissionType.BOOKING_CREATE)
  @ApiOperation({ summary: "Crear una reserva (ADMIN o AGENT)" })
  @ApiResponse({ status: 201, type: BookingResponse })
  async createBooking(@Body() dto: BookingCreateRequest, @Req() req) {
    return this.bookingService.createBooking(dto, req.user.username);
  }

  @Get()
  @Permissions(PermissionType.BOOKING_VIEW)
  @ApiOperation({ summary: "Listado paginado de bookings" })
  @ApiResponse({ status: 200, type: Page<BookingResponse> })
  async searchBookings(@Query() query: BookingSearchRequest) {
    return this.bookingService.searchBookings(query);
  }

  @Get("/:id")
  @Permissions(PermissionType.BOOKING_VIEW)
  @ApiOperation({ summary: "Obtener un booking por ID" })
  @ApiResponse({ status: 200, type: BookingResponse })
  async getBookingById(@Param("id", ParseIntPipe) id: number) {
    return this.bookingService.getBookingById(id);
  }

  @Patch("/:id")
  @Permissions(PermissionType.BOOKING_EDIT)
  @ApiOperation({ summary: "Actualizar estado del booking (ADMIN o AGENT)" })
  @ApiResponse({ status: 200, type: BookingResponse })
  async updateBooking(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: BookingUpdateRequest
  ) {
    return this.bookingService.updateBooking(id, dto);
  }

  @Delete("/:id")
  @Permissions(PermissionType.BOOKING_CANCEL)
  @ApiOperation({ summary: "Eliminar un booking (ADMIN)" })
  @ApiResponse({ status: 200 })
  async deleteBooking(@Param("id", ParseIntPipe) id: number) {
    return this.bookingService.deleteBooking(id);
  }
}
