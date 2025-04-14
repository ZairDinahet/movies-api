import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Movie } from '@prisma/client';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Movie[]> {
    return this.prisma.movie.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: string): Promise<Movie | null> {
    return this.prisma.movie.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async existsByEpisodeId(episodeId: number): Promise<boolean> {
    const movie = await this.prisma.movie.findFirst({
      where: { episodeId, deletedAt: null },
    });
    return !!movie;
  }

  async create(
    createMovieDto: CreateMovieDto,
    userId?: string,
  ): Promise<Movie> {
    return await this.prisma.movie.create({
      data: {
        ...createMovieDto,
        createdById: userId ? userId : undefined,
      },
    });
  }

  async update(id: string, data: UpdateMovieDto): Promise<Movie> {
    return this.prisma.movie.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Movie> {
    return this.prisma.movie.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async hardDelete(id: string): Promise<Movie> {
    return this.prisma.movie.delete({ where: { id } });
  }
}
