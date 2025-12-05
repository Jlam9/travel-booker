import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString, IsArray } from "class-validator";

export class RegisterRequest {

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: "Lista de roles del usuario. Ej: ['ADMIN', 'AGENT']. Si se omite, asigna VIEWER."
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleNames?: string[];

}
