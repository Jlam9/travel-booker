import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthController } from 'src/controller/auth/auth.controller';
import { AuthService } from 'src/service/auth/auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/service/account/user.service';
import request from 'supertest';

describe('Auth Login (e2e)', () => {
  let app: INestApplication;

  const mockUserService = {
    findByUsername: jest.fn().mockImplementation((email) => ({
      id: 1,
      email,
      name: 'Test User',
      passwordHash: 'hashed123',
      status: 'active',
    })),
  };

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
      expiresAt: Date.now() + 3600000,
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
        }),
      ],
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        LocalAuthGuard,
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { email: 'test@example.com' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) debe generar un JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '123456' })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
