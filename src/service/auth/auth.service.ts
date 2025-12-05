import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenRequest } from "src/dto/auth/refresh-token-request.";
import { TokenResponse } from "src/dto/auth/token-response.dto";
import { UserStatusType } from "src/type/account/user-status.type";
import { UserService } from "../account/user.service";
import { TokenRequest } from "src/dto/auth/token-request.dto";
import { RegisterRequest } from "src/dto/auth/register-request.dto";
import * as bcrypt from "bcryptjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/model/account/role.entity";
import { Repository } from "typeorm";
import { UserRole } from "src/model/account/user-role.entity";

@Injectable()
export class AuthService {

  defaultExpireInHours: number = 8;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const fixedEmail = email.toLowerCase().trim();
    const user = await this.userService.findByUsername(fixedEmail);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;

    if (user.status === UserStatusType.Disabled) return null;
    if (user.email !== fixedEmail) return null;

    const { passwordHash, ...result } = user;
    return result;
  }

  async register(data: RegisterRequest) {
    const email = data.email.toLowerCase().trim();

    // Validamos si usuario ya existe
    const existing = await this.userService.findByUsername(email);
    if (existing) {
      throw new Error('El usuario ya existe');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    // Crear usuario
    const newUser = await this.userService.createUser(data);

    // Seleccionar rol: si se envía, usarlo; si no, VIEWER
    const roleName = data.roleName?.toUpperCase().trim() || 'VIEWER';

    const role = await this.roleRepository.findOne({ where: { name: roleName } });

    if (!role) {
      throw new Error(`El rol ${roleName} no existe`);
    }

    // Asignar el rol al usuario
    const userRole = this.userRoleRepository.create({
      user: newUser,
      role: role
    });

    await this.userRoleRepository.save(userRole);

    // Crear JWT
    const payload = { username: newUser.email };

    const accessToken = this.jwtService.sign(payload, { expiresIn: "8h" });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "30 days" });

    return new TokenResponse(accessToken, refreshToken, this.getExpiration());
  }

  async getToken(tokenRequest: TokenRequest) {
    const user = await this.userService.findByUsername(
      tokenRequest.email.toLowerCase().trim()
    );
    if (!user) return;

    const payload = { username: user.email };

    const accessToken = this.jwtService.sign(payload, { expiresIn: "8h" });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "30 days" });

    return new TokenResponse(accessToken, refreshToken, this.getExpiration());
  }

  async refreshToken(refreshTokenRequest: RefreshTokenRequest) {
    const { refreshToken } = refreshTokenRequest;
    const result: any = this.jwtService.verify(refreshToken);

    const user = await this.userService.findByUsername(result.username);
    if (!user) return;

    const payload = { username: result.username };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "8h"
    });

    return new TokenResponse(accessToken, refreshToken, this.getExpiration());
  }
  
  // Expiración para swagger
  private getExpiration() {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.defaultExpireInHours);
    return expiresAt.getTime();
  }
}
