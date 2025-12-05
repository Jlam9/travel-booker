import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseFilters
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomErrorFilter } from 'src/config/exception/customer-error.filter';
import { Permissions } from 'src/decorators/permission.decorator';
import { Page } from 'src/dto/common/page';
import { RoleResponse } from 'src/dto/role/role-response.dto';
import { RoleSearchRequest } from 'src/dto/role/role-search-request.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { RoleService } from 'src/service/account/role.service';
import { PermissionType } from 'src/type/account/permission.type';


@ApiTags('Roles')
@UseFilters(new CustomErrorFilter())
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('/roles')
export class RolesController {

  constructor(private readonly roleService: RoleService) { }

  @Get()
  @Permissions(PermissionType.USER_VIEW)
  @ApiOperation({ summary: 'Listado paginado de roles (ADMIN)' })
  @ApiResponse({
    status: 200,
    type: Page<RoleResponse>,
    description: 'Página de roles con filtros'
  })
  async searchRoles(@Query() query: RoleSearchRequest) {
    return this.roleService.searchRoles(query);
  }
}
