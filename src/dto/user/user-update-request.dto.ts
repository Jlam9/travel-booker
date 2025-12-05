import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { UserStatusType } from "src/type/account/user-status.type";

export class UserUpdateRequest {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: UserStatusType })
  @IsOptional()
  @IsEnum(UserStatusType)
  status?: UserStatusType;

  @ApiPropertyOptional({
    description: "Lista de roles (ej: ['ADMIN','AGENT'])",
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
