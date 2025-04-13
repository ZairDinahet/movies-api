import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  IsDate,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsInt()
  episodeId: number;

  @ApiProperty()
  @IsString()
  openingCrawl: string;

  @ApiProperty()
  @IsString()
  director: string;

  @ApiProperty()
  @IsString()
  producer: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  releaseDate: Date;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  species: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  starships: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  vehicles: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  characters: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  planets: string[];

  @ApiProperty()
  @IsString()
  url: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  createdById?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;
}
