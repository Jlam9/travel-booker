import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserStatusType } from "src/type/account/user-status.type";

export class UserCreateRequest {

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: UserStatusType })
  @IsOptional()
  @IsEnum(UserStatusType)
  status?: UserStatusType = UserStatusType.Active;

  @ApiProperty({
    description: "Lista de roles (ej: ['ADMIN','AGENT'])",
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
