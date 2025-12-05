import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsBooleanString, IsInt, Min } from "class-validator";
import { PaginatedSearchRequest } from "../common/paginated-search-request.dto";

export class DestinationSearchRequest extends PaginatedSearchRequest {

  @ApiPropertyOptional({ description: "Filtra por país", example: "Mexico" })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: "Filtra por ciudad", example: "Cancún" })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: "Filtra por estado activo", example: "true" })
  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}
