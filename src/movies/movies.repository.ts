import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Movie } from '@prisma/client';

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
    return this.prisma.movie.findFirst({
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

  async create(data: Prisma.MovieCreateInput): Promise<Movie> {
    return this.prisma.movie.create({ data });
  }

  async update(id: string, data: Prisma.MovieUpdateInput): Promise<Movie> {
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
