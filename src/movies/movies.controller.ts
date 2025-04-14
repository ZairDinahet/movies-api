import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
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
import { SyncResultDto } from './dto/sync-result.dto';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-user.interface';
@ApiTags('Movies')
@Controller('movies')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Roles(ADMIN)
  @ApiOperation({ summary: 'Create a new movie (ADMIN only)' })
  @ApiResponse({
    status: 201,
    description: 'Movie created successfully',
    type: MovieDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post()
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<MovieDto> {
    return this.moviesService.create(createMovieDto, req.user);
  }

  @ApiOperation({ summary: 'Get all movies (USER and ADMIN)' })
  @ApiResponse({ status: 200, description: 'List of movies', type: [MovieDto] })
  @Get()
  async findAll(): Promise<MovieDto[] | null> {
    return this.moviesService.findAll();
  }

  @Roles(ADMIN)
  @ApiOperation({
    summary: 'Sync movies from SWAPI, only new ones (ADMIN only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Synchronization complete',
    type: SyncResultDto,
  })
  @Get('sync-swapi')
  async syncFromSwapi(): Promise<SyncResultDto> {
    return this.moviesService.syncFromSwapi();
  }

  @Roles(USER)
  @ApiOperation({ summary: 'Get a movie by ID (USER only)' })
  @ApiParam({ name: 'id', description: 'ID of the movie' })
  @ApiResponse({ status: 200, description: 'Movie found', type: MovieDto })
  @ApiResponse({ status: 404, description: 'Movie with ID not found' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MovieDto | null> {
    return this.moviesService.findOne(id);
  }

  @Roles(ADMIN)
  @ApiOperation({ summary: 'Update a movie (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'ID of the movie to update' })
  @ApiResponse({
    status: 200,
    description: 'Movie updated successfully',
    type: MovieDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Movie with ID not found' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<MovieDto> {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Roles(ADMIN)
  @ApiOperation({ summary: 'Soft delete a movie (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'ID of the movie to soft delete' })
  @ApiResponse({
    status: 200,
    description: 'Movie soft deleted',
    type: MovieDto,
  })
  @ApiResponse({ status: 404, description: 'Movie with ID not found' })
  @Delete(':id/soft')
  async softDelete(@Param('id') id: string): Promise<MovieDto> {
    return this.moviesService.softDelete(id);
  }

  @Roles(ADMIN)
  @ApiOperation({ summary: 'Hard delete a movie (permanent) (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'ID of the movie to hard delete' })
  @ApiResponse({
    status: 200,
    description: 'Movie permanently deleted',
    type: MovieDto,
  })
  @ApiResponse({ status: 404, description: 'Movie with ID not found' })
  @Delete(':id/hard')
  async hardDelete(@Param('id') id: string): Promise<MovieDto> {
    return this.moviesService.hardDelete(id);
  }
}
