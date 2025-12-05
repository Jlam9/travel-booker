import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { PermissionDto } from "./permission.dto";

export class RoleDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty({ type: () => [PermissionDto] })
  @Expose()
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
