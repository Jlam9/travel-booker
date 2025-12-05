import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class DestinationResponse {

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  country: string;

  @ApiProperty()
  @Expose()
  city: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;
}
