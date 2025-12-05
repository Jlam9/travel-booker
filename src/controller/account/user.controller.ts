import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseFilters, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CustomErrorFilter } from "src/config/exception/customer-error.filter";
import { Permissions } from "src/decorators/permission.decorator";
import { UserCreateRequest } from "src/dto/user/user-create-request.dto";
import { UserResponse } from "src/dto/user/user-response.dto";
import { UserSearchRequest } from "src/dto/user/user-search-request.dto";
import { UserUpdateRequest } from "src/dto/user/user-update-request.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { PermissionGuard } from "src/guards/permission.guard";
import { UserService } from "src/service/account/user.service";
import { PermissionType } from "src/type/account/permission.type";

@ApiTags('UserController')
@UseGuards(JwtAuthGuard, PermissionGuard)
@UseFilters(new CustomErrorFilter())
@Controller('/users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.USER_VIEW)
  async searchUsers(@Query() query: UserSearchRequest) {
    return this.userService.searchUsers(query);
  }


  @ApiResponse({ status: 201, type: UserResponse })
  @Post('/users')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.USER_CREATE, PermissionType.USER_ASSIGN_ROLE)
  async createUser(@Body() dto: UserCreateRequest) {
    return this.userService.createUserInternal(dto);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.USER_EDIT)
  @ApiOperation({ summary: 'Actualizar datos básicos de un usuario (nombre, status)' })
  @ApiResponse({ status: 200, type: UserResponse })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserUpdateRequest
  ) {
    return this.userService.updateUser(id, dto);
  }

  @Patch('/:id/roles')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.USER_ASSIGN_ROLE)
  @ApiOperation({ summary: 'Asignar o cambiar roles de un usuario' })
  @ApiResponse({ status: 200, type: UserResponse })
  async updateUserRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserUpdateRequest
  ) {
    return this.userService.updateUserRoles(id, dto);
  }


}