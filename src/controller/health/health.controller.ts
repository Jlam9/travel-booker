import { Controller, Get, UseFilters } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiResponse } from "@nestjs/swagger";
import { CustomErrorFilter } from "src/config/exception/customer-error.filter";
import { HealthResponse } from "src/dto/health/health.dto";
import { HealthService } from "src/service/health/health.service";

@ApiTags("Health")
@UseFilters(new CustomErrorFilter())
@Controller("/health")
export class HealthController {

  constructor(private readonly healthService: HealthService) { }

  @Get()
  @ApiOperation({ summary: "Healthcheck del sistema" })
  @ApiResponse({ status: 200, type: HealthResponse })
  async healthCheck() {
    const dbStatus = await this.healthService.checkDatabase();

    return {
      status: "ok",
      details: dbStatus
    } satisfies HealthResponse;
  }

}
