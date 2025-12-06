import { Reflector } from "@nestjs/core";
import { UserService } from "src/service/account/user.service";
import { PermissionType } from "src/type/account/permission.type";
import { MessageCodes } from "src/config/exception/internal-message-code";
import { CustomError } from "src/config/exception/custom.error";
import { PermissionGuard } from "src/common/guards/permission.guard";

describe("PermissionGuard - Acceso restringido", () => {

  const reflector = {
    getAllAndOverride: jest.fn()
  };

  const mockUserService = {
    getUserWithPermissions: jest.fn()
  };

  const guard = new PermissionGuard(
    reflector as any,
    mockUserService as any
  );

  const executionContext: any = {
    switchToHttp: () => ({
      getRequest: () => ({
        user: { username: "viewer@example.com" }
      })
    }),
    getHandler: () => null,
    getClass: () => null
  };

  it("Debe bloquear acceso si el usuario VIEWER no tiene permisos requeridos", async () => {

    reflector.getAllAndOverride.mockReturnValue([PermissionType.BOOKING_CREATE]);

    mockUserService.getUserWithPermissions.mockResolvedValue({
      email: "viewer@example.com",
      roles: [
        {
          name: "VIEWER",
          permissions: [] // No tiene permisos
        }
      ]
    });

    await expect(guard.canActivate(executionContext)).rejects.toThrow(CustomError);

    await expect(guard.canActivate(executionContext)).rejects.toMatchObject({
      messageCode: MessageCodes.MissingPermissions
    });
  });

});
