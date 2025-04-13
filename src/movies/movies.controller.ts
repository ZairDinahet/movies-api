import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieDto } from './dto/movie.dto'; // Importando el DTO de respuesta

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async findAll(
    @Query('title') title?: string,
  ): Promise<MovieDto[] | MovieDto | null> {
    if (title) {
      return this.moviesService.findByTitle(title);
    }
    return this.moviesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MovieDto | null> {
    return this.moviesService.findOne(id);
  }

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto): Promise<MovieDto> {
    return this.moviesService.create(createMovieDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<MovieDto> {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete('hard/:id')
  async hardDelete(@Param('id') id: string): Promise<MovieDto> {
    return this.moviesService.hardDelete(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<MovieDto> {
    return this.moviesService.remove(id);
  }
}
