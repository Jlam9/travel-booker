import { Controller, Get, UseFilters } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { MetricsResponse } from "src/dto/metrics/metrics-response.dto";
import { CustomErrorFilter } from "src/config/exception/customer-error.filter";
import { MetricsService } from "src/service/metrics/metrics.service";

@ApiTags("Metrics")
@UseFilters(new CustomErrorFilter())
@Controller("/metrics")
export class MetricsController {

  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @ApiOperation({ summary: "Obtiene métricas básicas del sistema" })
  @ApiResponse({ status: 200, type: MetricsResponse })
  async getMetrics() {
    return this.metricsService.getMetrics();
  }
}
