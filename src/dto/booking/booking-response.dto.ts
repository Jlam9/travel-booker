import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { BookingStatusType } from "src/type/booking/booking-status.type";

export class BookingResponse {

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  customerName: string;

  @ApiProperty()
  @Expose()
  customerEmail: string;

  @ApiProperty()
  @Expose()
  destinationId: number;

  @ApiProperty()
  @Expose()
  status: BookingStatusType;

  @ApiProperty()
  @Expose()
  travelDate: Date;

  @ApiProperty()
  @Expose()
  createdByUserId: number;
}
