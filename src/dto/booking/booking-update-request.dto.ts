import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { BookingStatusType } from "src/type/booking/booking-status.type";

export class BookingUpdateRequest {

  @ApiProperty({
    example: BookingStatusType.Confirmed,
    enum: BookingStatusType
  })
  @IsEnum(BookingStatusType)
  status: BookingStatusType;
}
