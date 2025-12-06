import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum, IsInt, Min, IsDateString } from "class-validator";
import { BookingStatusType } from "src/type/booking/booking-status.type";
import { PaginatedSearchRequest } from "../common/paginated-search-request.dto";

export class BookingSearchRequest extends PaginatedSearchRequest {

  @ApiPropertyOptional({
    example: BookingStatusType.Pending,
    enum: BookingStatusType
  })
  @IsOptional()
  @IsEnum(BookingStatusType)
  status?: BookingStatusType;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  destinationId?: number;

  @ApiPropertyOptional({
    example: "2025-01-01T00:00:00.000Z"
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    example: "2025-12-31T23:59:59.000Z"
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

}
