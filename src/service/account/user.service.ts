import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { CustomError } from "src/config/exception/custom.error";
import { MessageCodes } from "src/config/exception/internal-message-code";
import { UserWithPermissionsDto } from "src/dto/account/user-with-permission.dto";
import { RegisterRequest } from "src/dto/auth/register-request.dto";
import { createPage } from "src/dto/common/page";
import { UserCreateRequest } from "src/dto/user/user-create-request.dto";
import { UserListItemResponse } from "src/dto/user/user-list-response.dto";
import { UserSearchRequest } from "src/dto/user/user-search-request.dto";
import { User } from "src/model/account/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { UserStatusType } from "src/type/account/user-status.type";
import { UserResponse } from "src/dto/user/user-response.dto";
import { Role } from "src/model/account/role.entity";
import { UserRole } from "src/model/account/user-role.entity";
import { UserUpdateRequest } from "src/dto/user/user-update-request.dto";
@Injectable()
export class UserService {

  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) { }

  async searchUsers(query: UserSearchRequest) {

    const { page, size, search, status, role } = query;

    const qb = this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userRoles', 'ur')
      .leftJoinAndSelect('ur.role', 'r')
      .orderBy('u.id', 'DESC');

    if (search) {
      qb.andWhere('(u.name LIKE :s OR u.email LIKE :s)', {
        s: `%${search.trim()}%`
      });
    }

    if (status) {
      qb.andWhere('u.status = :status', { status });
    }

    if (role) {
      qb.andWhere('r.name = :role', { role: role.toUpperCase() });
    }

    qb.skip(page * size).take(size);

    const [users, total] = await qb.getManyAndCount();

    const result = users.map(u => ({
      ...u,
      roles: u.userRoles.map(ur => ur.role)
    }));

    const userList: UserListItemResponse[] = plainToInstance(UserListItemResponse, result, { excludeExtraneousValues: true });

    return createPage(userList, page, size, total);
  }


  async createUserInternal(data: UserCreateRequest) {

    const { email: rawEmail, name, password, status, roles: rawRoles } = data;

    const email = rawEmail.toLowerCase().trim();

    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new CustomError(MessageCodes.EmailAlreadyExists, { email });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    let user = this.userRepository.create({
      email,
      name,
      passwordHash: hashedPassword,
      status: status ?? UserStatusType.Active
    });

    user = await this.userRepository.save(user);

    // Procesar roles
    const roleNames = rawRoles.map(r => r.toUpperCase().trim());

    const roles = await this.roleRepository.find({
      where: roleNames.map(name => ({ name }))
    });

    if (roles.length !== roleNames.length) {
      throw new CustomError(MessageCodes.RoleNotFound, {
        role: roleNames.join(", ")
      });
    }

    const userRoles = roles.map(role =>
      this.userRoleRepository.create({ user, role })
    );

    await this.userRoleRepository.save(userRoles);

    const flattened = {
      ...user,
      roles
    };

    return plainToInstance(UserResponse, flattened, {
      excludeExtraneousValues: true
    });
  }

  async updateUser(id: number, data: UserUpdateRequest) {

    const { name, status } = data;

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new CustomError(MessageCodes.UserNotFound, { email: id });
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (status !== undefined) {
      user.status = status;
    }

    const updated = await this.userRepository.save(user);

    // Obtener roles del usuario
    const userRoles = await this.userRoleRepository.find({
      where: { user: { id } },
      relations: ['role']
    });

    const flattened = {
      ...updated,
      roles: userRoles.map(ur => ur.role)
    };

    return plainToInstance(UserResponse, flattened, {
      excludeExtraneousValues: true
    });
  }

  async updateUserRoles(id: number, data: UserUpdateRequest) {
    const { roles: rawRoles } = data;

    if (!rawRoles || rawRoles.length === 0) {
      throw new CustomError(MessageCodes.RoleNotFound, { role: 'Ninguno recibido' });
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new CustomError(MessageCodes.UserNotFound, { email: id });
    }

    const roleNames = rawRoles.map(r => r.toUpperCase().trim());

    const roles = await this.roleRepository.find({
      where: roleNames.map(name => ({ name }))
    });

    if (roles.length !== roleNames.length) {
      throw new CustomError(MessageCodes.RoleNotFound, {
        role: roleNames.join(", ")
      });
    }

    // Primero borramos roles anteriores
    await this.userRoleRepository.delete({ user: { id } });

    // Luego asignamos los nuevos
    const userRoles = roles.map(role =>
      this.userRoleRepository.create({ user, role })
    );

    await this.userRoleRepository.save(userRoles);

    const flattened = {
      ...user,
      roles
    };

    return plainToInstance(UserResponse, flattened, {
      excludeExtraneousValues: true
    });
  }



  async createUser(request: RegisterRequest) {
    const user = this.userRepository.create({
      email: request.email.toLowerCase().trim(),
      name: request.name,
      passwordHash: request.password
    });

    return await this.userRepository.save(user);
  }

  async findByUsername(identifier: string) {
    return await this.userRepository.findOneBy([
      { email: identifier }
    ]);
  }

  async getUserWithPermissions(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: {
        userRoles: {
          role: {
            rolePermissions: {
              permission: true
            }
          }
        }
      }
    });

    if (!user) return null;

    const roles = user.userRoles.map(ur => {
      const role = ur.role;

      return {
        ...role,
        permissions: role.rolePermissions.map(rp => rp.permission),
      };
    });

    const result = {
      ...user,
      roles,
    };

    return plainToInstance(UserWithPermissionsDto, result, {
      excludeExtraneousValues: true,
    });
  }



}
