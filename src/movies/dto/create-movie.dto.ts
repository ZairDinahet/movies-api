import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  IsDate,
  IsUUID,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsInt()
  episodeId: number;

  @IsString()
  openingCrawl: string;

  @IsString()
  director: string;

  @IsString()
  producer: string;

  @IsDate()
  @Type(() => Date)
  releaseDate: Date;

  @IsArray()
  @IsString({ each: true })
  species: string[];

  @IsArray()
  @IsString({ each: true })
  starships: string[];

  @IsArray()
  @IsString({ each: true })
  vehicles: string[];

  @IsArray()
  @IsString({ each: true })
  characters: string[];

  @IsArray()
  @IsString({ each: true })
  planets: string[];

  @IsString()
  url: string;

  @IsOptional()
  @IsUUID()
  createdById?: string; // Optional, if you're storing who created the movie

  @IsOptional()
  @IsDate()
  deletedAt?: Date; // Optional, in case you're implementing soft deletes
}
