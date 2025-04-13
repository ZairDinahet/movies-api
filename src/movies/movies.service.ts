import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieDto } from './dto/movie.dto';
import { MoviesRepository } from './movies.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async findAll(): Promise<MovieDto[]> {
    const movies = await this.moviesRepository.findAll();
    return plainToInstance(MovieDto, movies);
  }

  async findByTitle(title: string): Promise<MovieDto | null> {
    const movie = await this.moviesRepository.findByTitle(title);
    return movie ? plainToInstance(MovieDto, movie) : null;
  }

  async findOne(id: string): Promise<MovieDto | null> {
    const movie = await this.moviesRepository.findOne(id);
    return movie ? plainToInstance(MovieDto, movie) : null;
  }

  async create(createMovieDto: CreateMovieDto): Promise<MovieDto> {
    const movie = await this.moviesRepository.create(createMovieDto);
    return plainToInstance(MovieDto, movie);
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<MovieDto> {
    const movie = await this.moviesRepository.update(id, updateMovieDto);
    return plainToInstance(MovieDto, movie);
  }

  async remove(id: string): Promise<MovieDto> {
    const movie = await this.moviesRepository.remove(id);
    return plainToInstance(MovieDto, movie);
  }

  async hardDelete(id: string): Promise<MovieDto> {
    const movie = await this.moviesRepository.hardDelete(id);
    return plainToInstance(MovieDto, movie);
  }
}
