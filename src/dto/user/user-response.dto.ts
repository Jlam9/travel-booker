import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { UserStatusType } from "src/type/account/user-status.type";
import { RoleDto } from "../account/role.dto";

export class UserResponse {

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ enum: UserStatusType })
  @Expose()
  status: UserStatusType;

  @ApiProperty({ type: () => [RoleDto] })
  @Expose()
  @Type(() => RoleDto)
  roles: RoleDto[];
}
