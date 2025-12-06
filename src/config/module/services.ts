import { JwtStrategy } from "src/common/strategy/jwt.strategy";
import { LocalStrategy } from "src/common/strategy/local.strategy";
import { RoleService } from "src/service/account/role.service";
import { UserService } from "src/service/account/user.service";
import { AuthService } from "src/service/auth/auth.service";
import { BookingService } from "src/service/booking/booking.service";
import { DestinationService } from "src/service/destination/destination.service";
import { HealthService } from "src/service/health/health.service";
import { MetricsService } from "src/service/metrics/metrics.service";

export const Services = {
  AccountServices: [
    RoleService,
    UserService
  ],
  AuthServices: [
    LocalStrategy,
    JwtStrategy,
    AuthService
  ],
  BookingServices: [
    BookingService
  ],
  DestinationServices: [
    DestinationService
  ],
  UtilServices: [
    HealthService,
    MetricsService
  ]


};