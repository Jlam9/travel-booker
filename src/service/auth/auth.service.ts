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
import { CustomError } from "src/config/exception/custom.error";
import { MessageCodes } from "src/config/exception/internal-message-code";

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
    if (!user) {
      throw new CustomError(MessageCodes.InvalidCredentials);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new CustomError(MessageCodes.InvalidCredentials);
    }

    if (user.status === UserStatusType.Disabled) {
      throw new CustomError(MessageCodes.UserDisabled);
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async register(data: RegisterRequest) {
    const email = data.email.toLowerCase().trim();

    // Validar si usuario existe
    const existing = await this.userService.findByUsername(email);
    if (existing) throw new Error('El usuario ya existe');

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    // Crear usuario
    const newUser = await this.userService.createUser(data);

    // Procesar roles
    let roleNames = data.roleNames;

    // Si no se envían roles, asignar VIEWER
    if (!roleNames || roleNames.length === 0) {
      roleNames = ['VIEWER'];
    }

    // Normalizar roles
    roleNames = roleNames.map(r => r.toUpperCase().trim());

    // Buscar roles válidos
    const roles = await this.roleRepository.find({
      where: roleNames.map(name => ({ name }))
    });

    if (roles.length !== roleNames.length) {
      throw new Error(`Uno o varios roles no existen: ${roleNames.join(', ')}`);
    }

    // Asignar roles al usuario
    const userRoles = roles.map(role =>
      this.userRoleRepository.create({ user: newUser, role })
    );

    await this.userRoleRepository.save(userRoles);

    // Crear JWT
    const payload = { username: newUser.email };

    const accessToken = this.jwtService.sign(payload, { expiresIn: "8h" });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "30 days" });

    return new TokenResponse(accessToken, refreshToken, this.getExpiration());
  }


  async login(tokenRequest: TokenRequest) {
    const { email } = tokenRequest;
    const user = await this.userService.findByUsername(email);

    if (!user) {
      throw new CustomError(MessageCodes.UserNotFound, { email });
    }

    const payload = { username: user.email };

    const accessToken = this.jwtService.sign(payload, { expiresIn: "8h" });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "30 days" });

    return new TokenResponse(accessToken, refreshToken, this.getExpiration());
  }

  async refreshToken(refreshTokenRequest: RefreshTokenRequest) {
    const { refreshToken } = refreshTokenRequest;
    const result: any = this.jwtService.verify(refreshToken);

    const user = await this.userService.findByUsername(result.username);
    if (!user) {
      throw new CustomError(MessageCodes.UserNotFound, { email: result.username });
    }

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
