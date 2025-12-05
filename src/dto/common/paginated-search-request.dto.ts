import { ApiProperty } from "@nestjs/swagger";

export class PaginatedSearchRequest {

  @ApiProperty({
    required: true,
    description: 'The page number that you want to retrieve',
    example: 0
  })
  page: number;

  @ApiProperty({
    required: true,
    description: 'The page size that you want to retrieve',
    example: 10
  })
  size: number;

}