import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class RoleResponse {

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;
}
