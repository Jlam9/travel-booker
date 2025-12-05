import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class TokenRequest {
  @ApiProperty({
    required: true,
    description: 'This is the username or email used to authenticate a user',
    examples: ['admin@example.com']
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    description: 'This is the password authenticate a user',
    examples: ['mynewagentpassword123']
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
