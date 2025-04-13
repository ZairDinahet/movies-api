import {
  IsString,
  IsArray,
  IsInt,
  IsDate,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class MovieDto {
  @IsUUID()
  id: string;

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
  createdById?: string;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
