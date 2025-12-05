import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsBoolean } from "class-validator";

export class DestinationUpdateRequest {

  @ApiPropertyOptional({ example: "Los Cabos Resort" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: "Mexico" })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: "Los Cabos" })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean; 
}
