import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString } from "class-validator";

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
    description: "Nombre del rol (ADMIN, AGENT, VIEWER). Si no se envía, se asigna VIEWER."
  })
  @IsOptional()
  @IsString()
  roleName?: string;
}
