import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MoviesRepository } from './movies.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository, PrismaService],
})
export class MoviesModule {}
