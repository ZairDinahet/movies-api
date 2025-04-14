import { ApiProperty } from '@nestjs/swagger';

export class SyncResultDto {
  @ApiProperty({
    example: 2,
    description: 'Cantidad de películas agregadas desde la API de SWAPI',
  })
  added: number;

  @ApiProperty({
    example: ['A New Hope', 'The Empire Strikes Back'],
    description: 'Títulos de las películas que fueron agregadas',
    type: [String],
  })
  titles: string[];
}
