import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { PaginatedSearchRequest } from "../common/paginated-search-request.dto";

export class RoleSearchRequest extends PaginatedSearchRequest {

  @ApiPropertyOptional({ description: "Filtro por nombre de rol", example: "ADMIN" })
  @IsOptional()
  @IsString()
  search?: string;

}
