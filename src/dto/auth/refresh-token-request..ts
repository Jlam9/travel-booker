import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequest {
  @ApiProperty({
    required: true,
    description: 'This is refresh token to reauthenticate a user',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
