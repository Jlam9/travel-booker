import { ApiProperty } from "@nestjs/swagger";

export class PaginatedSearchRequest {

  @ApiProperty({
    required: true,
    description: 'El número de página que deseas obtener',
    example: 0
  })
  page: number;

  @ApiProperty({
    required: true,
    description: 'El tamaño de la página que desear obtener',
    example: 10
  })
  size: number;

}