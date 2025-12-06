import { ApiProperty } from "@nestjs/swagger";

export class HealthResponse {

  @ApiProperty({
    example: "ok",
    description: "Estado general del servicio"
  })
  status: string;

  @ApiProperty({
    example: { database: "up" },
    description: "Detalle de los chequeos realizados (DB, etc.)"
  })
  details: any;
}
