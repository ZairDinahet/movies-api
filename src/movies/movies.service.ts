import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieDto } from './dto/movie.dto';
import axios from 'axios';
import { MoviesRepository } from './movies.repository';
import { plainToInstance } from 'class-transformer';
import { SyncResultDto } from './dto/sync-result.dto';
import { SwapiFilmsResponse } from './interfaces/swapi-film.interface';
import https from 'https';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

const agent = new https.Agent({
  rejectUnauthorized: false, // ¡No usar en producción!
});

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async findAll(): Promise<MovieDto[]> {
    const movies = await this.moviesRepository.findAll();
    return plainToInstance(MovieDto, movies);
  }

  async findOne(id: string): Promise<MovieDto | null> {
    const movie = await this.moviesRepository.findOne(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return plainToInstance(MovieDto, movie);
  }

  async create(
    createMovieDto: CreateMovieDto,
    user: JwtPayload,
  ): Promise<MovieDto> {
    const movie = await this.moviesRepository.create(createMovieDto, user.id);
    return plainToInstance(MovieDto, movie);
  }

  async syncFromSwapi(): Promise<SyncResultDto> {
    try {
      const response = await axios.get<SwapiFilmsResponse>(
        'https://swapi.dev/api/films',
        { httpsAgent: agent },
      );

      const swapiMovies = response.data.results;
      const addedMovies: string[] = [];

      for (const swapiMovie of swapiMovies) {
        const exists = await this.moviesRepository.existsByEpisodeId(
          swapiMovie.episode_id,
        );

        if (!exists) {
          await this.moviesRepository.create({
            title: swapiMovie.title,
            episodeId: swapiMovie.episode_id,
            openingCrawl: swapiMovie.opening_crawl,
            director: swapiMovie.director,
            producer: swapiMovie.producer,
            releaseDate: new Date(swapiMovie.release_date),
            url: swapiMovie.url,
            species: swapiMovie.species,
            starships: swapiMovie.starships,
            vehicles: swapiMovie.vehicles,
            characters: swapiMovie.characters,
            planets: swapiMovie.planets,
          });
          addedMovies.push(swapiMovie.title);
        }
      }

      return { added: addedMovies.length, titles: addedMovies };
    } catch {
      throw new BadRequestException('Failed to sync from SWAPI');
    }
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<MovieDto> {
    await this.findOne(id);
    const updated = await this.moviesRepository.update(id, updateMovieDto);
    return plainToInstance(MovieDto, updated);
  }

  async softDelete(id: string): Promise<MovieDto> {
    await this.findOne(id);
    const deleted = await this.moviesRepository.softDelete(id);
    return plainToInstance(MovieDto, deleted);
  }

  async hardDelete(id: string): Promise<MovieDto> {
    await this.findOne(id);
    const deleted = await this.moviesRepository.hardDelete(id);
    return plainToInstance(MovieDto, deleted);
  }
}
