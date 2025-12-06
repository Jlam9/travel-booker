import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, IsInt, Min, IsEnum, IsDateString } from "class-validator";
import { BookingStatusType } from "src/type/booking/booking-status.type";

export class BookingCreateRequest {

  @ApiProperty({ example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  destinationId: number;

  @ApiProperty({ example: "2025-06-15T00:00:00.000Z" })
  @IsDateString()
  travelDate: string;
}
