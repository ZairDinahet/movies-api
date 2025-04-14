import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieDto } from './dto/movie.dto';
import axios from 'axios';
import { MoviesRepository } from './movies.repository';
import { plainToInstance } from 'class-transformer';
import { SyncResultDto } from './dto/sync-result.dto';
import { SwapiFilmsResponse } from './interfaces/swapi-film.interface';
import https from 'https';

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
    return movie ? plainToInstance(MovieDto, movie) : null;
  }

  async create(createMovieDto: CreateMovieDto): Promise<MovieDto> {
    const movie = await this.moviesRepository.create(createMovieDto);
    return plainToInstance(MovieDto, movie);
  }

  async syncFromSwapi(): Promise<SyncResultDto> {
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
          origin: 'SWAPI',
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
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<MovieDto> {
    const movie = await this.moviesRepository.update(id, updateMovieDto);
    return plainToInstance(MovieDto, movie);
  }

  async softDelete(id: string): Promise<MovieDto> {
    const movie = await this.moviesRepository.softDelete(id);
    return plainToInstance(MovieDto, movie);
  }

  async hardDelete(id: string): Promise<MovieDto> {
    const movie = await this.moviesRepository.hardDelete(id);
    return plainToInstance(MovieDto, movie);
  }
}
