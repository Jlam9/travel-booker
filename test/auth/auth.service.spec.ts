import { UserService } from "src/service/account/user.service";
import { JwtService } from "@nestjs/jwt";
import { MessageCodes } from "src/config/exception/internal-message-code";
import { CustomError } from "src/config/exception/custom.error";
import { AuthService } from "src/service/auth/auth.service";

describe("AuthService - Login y JWT", () => {

  const mockUser = {
    id: 1,
    email: "viewer@example.com",
    passwordHash: "password123",
    status: "active"
  };

  const mockUserService = {
    findByUsername: jest.fn()
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue("FAKE_JWT_TOKEN")
  };

  const authService = new AuthService(
    mockUserService as any,
    mockJwtService as any,
    {} as any,
    {} as any
  );

  it("Debe generar un JWT cuando el login es válido", async () => {
    mockUserService.findByUsername.mockResolvedValue(mockUser);

    const result = await authService.login({ email: "viewer@example.com", password: "password123" });

    expect(result.accessToken).toBe("FAKE_JWT_TOKEN");
    expect(result.refreshToken).toBe("FAKE_JWT_TOKEN");
    expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
  });

  it("Debe lanzar error si el usuario no existe", async () => {
    mockUserService.findByUsername.mockResolvedValue(null);

    await expect(
      authService.login({ email: "viewer@example.com", password: "password123" })
    ).rejects.toThrow(CustomError);

    await expect(
      authService.login({ email: "viewer@example.com", password: "password123" })
    ).rejects.toMatchObject({
      messageCode: MessageCodes.UserNotFound
    });
  });
});
