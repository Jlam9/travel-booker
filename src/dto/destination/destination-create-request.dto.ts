import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class DestinationCreateRequest {

  @ApiProperty({ example: "Cancún Paradise" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "Mexico" })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: "Cancún" })
  @IsString()
  @IsNotEmpty()
  city: string;
}
