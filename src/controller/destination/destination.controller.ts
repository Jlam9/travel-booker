import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseFilters,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Patch,
  Delete
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PermissionGuard } from 'src/guards/permission.guard';
import { PermissionType } from 'src/type/account/permission.type';

import { CustomErrorFilter } from 'src/config/exception/customer-error.filter';
import { DestinationService } from 'src/service/destination/destination.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Permissions, PublicPermissions } from 'src/decorators/permission.decorator';
import { DestinationResponse } from 'src/dto/destination/destination-response.dto';
import { DestinationCreateRequest } from 'src/dto/destination/destination-create-request.dto';
import { Page } from 'src/dto/common/page';
import { DestinationSearchRequest } from 'src/dto/destination/destination-search-request-dto';
import { DestinationUpdateRequest } from 'src/dto/destination/destination-update-request.dto';

@ApiTags("Destinations")
@UseGuards(JwtAuthGuard, PermissionGuard)
@UseFilters(new CustomErrorFilter())
@Controller("/destinations")
export class DestinationsController {

  constructor(private readonly destinationService: DestinationService) { }

  @Post()
  @Permissions(PermissionType.DESTINATION_CREATE)
  @ApiOperation({ summary: "Crear un destino (ADMIN o AGENT)" })
  @ApiResponse({ status: 201, type: DestinationResponse })
  async createDestination(@Body() dto: DestinationCreateRequest) {
    return this.destinationService.createDestination(dto);
  }

  @Get()
  @ApiOperation({ summary: "Listado paginado de destinos (público autenticado)" })
  @ApiResponse({
    status: 200,
    description: "Página de destinos",
    type: Page<DestinationResponse>
  })
  async searchDestinations(@Query() query: DestinationSearchRequest) {
    return this.destinationService.searchDestinations(query);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Obtener un destino por ID (público autenticado)" })
  @ApiResponse({ status: 200, type: DestinationResponse })
  @ApiResponse({ status: 404, description: "Destination not found" })
  async getDestinationById(@Param("id", ParseIntPipe) id: number) {
    return this.destinationService.getDestinationById(id);
  }

  @Patch("/:id")
  @Permissions(PermissionType.DESTINATION_EDIT)
  @ApiOperation({ summary: "Actualizar un destino (ADMIN o AGENT)" })
  @ApiResponse({ status: 200, type: DestinationResponse })
  @ApiResponse({ status: 404, description: "Destination not found" })
  async updateDestination(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: DestinationUpdateRequest
  ) {
    return this.destinationService.updateDestination(id, dto);
  }

  @Delete("/:id")
  @Permissions(PermissionType.DESTINATION_DELETE)
  @ApiOperation({ summary: "Eliminar un destino (ADMIN). Soft delete." })
  @ApiResponse({ status: 200, type: DestinationResponse })
  @ApiResponse({ status: 404, description: "Destination not found" })
  @ApiResponse({
    status: 400,
    description: "Destination has active bookings and cannot be deleted"
  })
  async deleteDestination(
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.destinationService.deleteDestination(id);
  }


}
