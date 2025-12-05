import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class TokenResponse {

  @ApiProperty({
    description: 'This is access token to authenticate requests'
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'This is refresh token to reauthenticate a user'
  })
  @IsString()
  refreshToken: string;

  @ApiProperty({
    description: 'This is the time when the access token will be expired'
  })
  @IsNumber()
  expiresAt: number;

  constructor(accessToken: string, refreshToken: string, expiresAt: number) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;
  }
}
