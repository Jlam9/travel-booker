import { RolesController } from "src/controller/account/role.controller";
import { UserController } from "src/controller/account/user.controller";
import { AuthController } from "src/controller/auth/auth.controller";
import { BookingsController } from "src/controller/booking/booking.controller";
import { DestinationsController } from "src/controller/destination/destination.controller";
import { HealthController } from "src/controller/health/health.controller";
import { MetricsController } from "src/controller/metrics/metrics.controller";

export const Controllers = {
  AuthControllers: [
    AuthController,
  ],
  AccountControllers: [
    RolesController,
    UserController
  ],
  BookingControllers: [
    BookingsController
  ],
  DestinationControllers: [
    DestinationsController
  ],
  UtilControllers: [
    HealthController,
    MetricsController
  ]
};