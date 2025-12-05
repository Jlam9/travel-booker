import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { RoleDto } from "./role.dto";

export class UserWithPermissionsDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty({ type: () => [RoleDto] })
  @Expose()
  @Type(() => RoleDto)
  roles: RoleDto[];
}
