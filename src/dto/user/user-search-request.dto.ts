import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { UserStatusType } from "src/type/account/user-status.type";
import { PaginatedSearchRequest } from "../common/paginated-search-request.dto";

export class UserSearchRequest extends PaginatedSearchRequest {

  @ApiPropertyOptional({ description: "Texto para buscar por nombre o email" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: UserStatusType })
  @IsOptional()
  @IsEnum(UserStatusType)
  status?: UserStatusType;

  @ApiPropertyOptional({ description: "Nombre del rol (ej: ADMIN, AGENT)" })
  @IsOptional()
  @IsString()
  role?: string;
  
}
