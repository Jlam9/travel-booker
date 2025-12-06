import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomError } from 'src/config/exception/custom.error';
import { MessageCodes } from 'src/config/exception/internal-message-code';
import { PERMISSIONS_KEY } from 'src/common/decorators/permission.decorator';
import { UserService } from 'src/service/account/user.service';
import { PermissionType } from 'src/type/account/permission.type';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private readonly userService: UserService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const requiredPermissions = this.reflector.getAllAndOverride<PermissionType[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      // No se requieren permisos
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new CustomError(MessageCodes.UnauthorizedError);
    }

    const dbUser = await this.userService.getUserWithPermissions(user.username);

    if (!dbUser) {
      throw new CustomError(MessageCodes.UserNotFound, { email: user.username });
    }

    const userPermissions = dbUser.roles.flatMap(
      role => role.permissions.map(p => p.name)
    );

    const hasAll = requiredPermissions.every(
      perm => userPermissions.includes(perm)
    );

    if (!hasAll) {
      const missing = requiredPermissions.filter(p => !userPermissions.includes(p)).join(', ');
      throw new CustomError(MessageCodes.MissingPermissions, { details: missing });
    }

    return true;

  }
}
