import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieDto } from './dto/movie.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ADMIN, USER } from 'src/common/constants';

@ApiTags('Movies')
@Controller('movies')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Roles(ADMIN)
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({
    status: 201,
    description: 'Movie created successfully',
    type: MovieDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<MovieDto> {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'List of movies', type: [MovieDto] })
  async findAll(): Promise<MovieDto[] | null> {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @Roles(USER)
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiParam({ name: 'id', description: 'ID of the movie' })
  @ApiResponse({ status: 200, description: 'Movie found', type: MovieDto })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async findOne(@Param('id') id: string): Promise<MovieDto | null> {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @Roles(ADMIN)
  @ApiOperation({ summary: 'Update a movie' })
  @ApiParam({ name: 'id', description: 'ID of the movie to update' })
  @ApiResponse({
    status: 200,
    description: 'Movie updated successfully',
    type: MovieDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<MovieDto> {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id/soft')
  @Roles(ADMIN)
  @ApiOperation({ summary: 'Soft delete a movie' })
  @ApiParam({ name: 'id', description: 'ID of the movie to soft delete' })
  @ApiResponse({
    status: 200,
    description: 'Movie soft deleted',
    type: MovieDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async softDelete(@Param('id') id: string): Promise<MovieDto> {
    return this.moviesService.softDelete(id);
  }

  @Delete(':id/hard')
  @Roles(ADMIN)
  @ApiOperation({ summary: 'Hard delete a movie (permanent)' })
  @ApiParam({ name: 'id', description: 'ID of the movie to hard delete' })
  @ApiResponse({
    status: 200,
    description: 'Movie permanently deleted',
    type: MovieDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async hardDelete(@Param('id') id: string): Promise<MovieDto> {
    return this.moviesService.hardDelete(id);
  }
}
