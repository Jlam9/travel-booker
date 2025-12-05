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
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { PermissionType } from 'src/type/account/permission.type';
import { Permissions } from 'src/decorators/permission.decorator';

@ApiTags('AuthController')
@UseGuards(JwtAuthGuard, PermissionGuard)
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
      password: '' // no importa, ya fue validado por LocalAuthGuard
    };

    return await this.authService.login(tokenRequest);
  }

  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  @Permissions(PermissionType.USER_CREATE, PermissionType.USER_ASSIGN_ROLE)
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
