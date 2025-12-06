import { ApiProperty } from "@nestjs/swagger";

export class MetricsResponse {

  @ApiProperty({
    example: 125,
    description: "Cantidad total de usuarios en el sistema"
  })
  totalUsers: number;

  @ApiProperty({
    example: 32,
    description: "Cantidad de destinos activos"
  })
  activeDestinations: number;

  @ApiProperty({
    example: 203,
    description: "Bookings creados (todas las reservas registradas)"
  })
  totalBookings: number;

  @ApiProperty({
    example: 15,
    description: "Bookings pendientes"
  })
  pendingBookings: number;

  @ApiProperty({
    example: 6,
    description: "Bookings confirmados"
  })
  confirmedBookings: number;

  @ApiProperty({
    example: 3,
    description: "Bookings cancelados"
  })
  cancelledBookings: number;

  @ApiProperty({
    example: 10240000,
    description: "Memoria usada por Node.js en bytes"
  })
  memoryUsed: number;

  @ApiProperty({
    example: 35123,
    description: "Tiempo que lleva vivo el servicio (en milisegundos)"
  })
  uptimeMs: number;

  @ApiProperty({
    example: "up",
    description: "Estado de la base de datos"
  })
  databaseStatus: string;
}
