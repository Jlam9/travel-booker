import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseFilters,
  Req
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CustomErrorFilter } from 'src/config/exception/customer-error.filter';
import { RefreshTokenRequest } from 'src/dto/auth/refresh-token-request.';
import { TokenRequest } from 'src/dto/auth/token-request.dto';
import { RegisterRequest } from 'src/dto/auth/register-request.dto';

import { AuthService } from 'src/service/auth/auth.service';
import { LocalAuthGuard } from 'src/service/auth/local-auth.guard';

@ApiTags('AuthController')
@UseFilters(new CustomErrorFilter())
@Controller('/auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) { }

  @ApiOperation({ summary: 'Autentica al usuario y genera tokens' })
  @ApiResponse({ status: 201, description: 'Token generado correctamente' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async getToken(@Req() req: any) {
    const user = req.user;

    const tokenRequest: TokenRequest = {
      email: user.email,
      password: ''
    };

    return await this.authService.getToken(tokenRequest);
  }

  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  @Post('/register')
  async register(@Body() registerRequest: RegisterRequest) {
    return await this.authService.register(registerRequest);
  }

  @ApiOperation({ summary: 'Generar un nuevo Access Token usando Refresh Token' })
  @ApiResponse({ status: 201, description: 'Token refrescado correctamente' })
  @Post('/refresh-token')
  async refreshToken(@Body() refreshTokenRequest: RefreshTokenRequest) {
    return await this.authService.refreshToken(refreshTokenRequest);
  }
}
