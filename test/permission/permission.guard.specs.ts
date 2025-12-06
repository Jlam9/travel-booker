import { Reflector } from "@nestjs/core";
import { UserService } from "src/service/account/user.service";
import { CustomError } from "src/config/exception/custom.error";
import { MessageCodes } from "src/config/exception/internal-message-code";
import { PermissionGuard } from "src/common/guards/permission.guard";
import { mockPermission, mockRole, mockUserWithPermissions } from "test/mocks/mock.repository";

describe("PermissionGuard", () => {
  let guard: PermissionGuard;
  let reflector: Reflector;
  let userService: UserService;

  beforeEach(() => {
    reflector = new Reflector();
    userService = {
      getUserWithPermissions: jest.fn()
    } as any;

    guard = new PermissionGuard(reflector, userService);
  });

  it("Debe impedir que un VIEWER cree un booking", async () => {
    const context: any = {
      getHandler: () => null,
      getClass: () => null,
      switchToHttp: () => ({
        getRequest: () => ({
          user: { username: "viewer@example.com" }
        })
      })
    };

    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["booking.create"]);

    // VIEWER tiene permiso únicamente booking.view
    jest.spyOn(userService, "getUserWithPermissions").mockResolvedValue(
      mockUserWithPermissions(
        mockRole("VIEWER", [mockPermission("booking.view")])
      )
    );



    await expect(guard.canActivate(context)).rejects.toThrow(CustomError);
  });
});
