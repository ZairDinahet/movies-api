import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { MoviesRepository } from './movies.repository';
import { NotFoundException } from '@nestjs/common';
import { Movie } from '@prisma/client';
import { CreateMovieDto } from './dto/create-movie.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

const mockMovie: Movie = {
  id: '1',
  title: 'A New Hope',
  episodeId: 4,
  openingCrawl: 'It is a period of civil war...',
  director: 'George Lucas',
  producer: 'Gary Kurtz',
  releaseDate: new Date('1977-05-25'),
  species: ['species1'],
  starships: ['starship1'],
  vehicles: ['vehicle1'],
  characters: ['character1'],
  planets: ['planet1'],
  url: 'http://swapi.dev/api/films/1/',
  createdById: '1fa54937-b1e7-458b-87af-ec886b5bc9c6',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockMoviesRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  hardDelete: jest.fn(),
};

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: MoviesRepository,
          useValue: mockMoviesRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      mockMoviesRepository.create.mockResolvedValue(mockMovie);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { deletedAt, createdAt, updatedAt, ...movieWithoutExtraFields } =
        mockMovie;
      const dto: CreateMovieDto = movieWithoutExtraFields as CreateMovieDto;
      const user: JwtPayload = {
        id: '1fa54937-b1e7-458b-87af-ec886b5bc9c6',
        role: 'ADMIN',
        email: 'example@gmail.com',
      };

      const result = await service.create(dto, user);

      expect(result).toEqual(mockMovie);
      expect(mockMoviesRepository.create).toHaveBeenCalledWith(dto, user.id);
    });
  });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      mockMoviesRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.findOne('1');

      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMoviesRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a movie', async () => {
      mockMoviesRepository.findOne.mockResolvedValue(mockMovie);
      mockMoviesRepository.softDelete.mockResolvedValue({
        ...mockMovie,
        deletedAt: new Date(),
      });

      const result = await service.softDelete('1');

      expect(result.deletedAt).not.toBeNull();
      expect(mockMoviesRepository.softDelete).toHaveBeenCalledWith('1');
    });
  });

  describe('hardDelete', () => {
    it('should hard delete a movie', async () => {
      mockMoviesRepository.findOne.mockResolvedValue(mockMovie);
      mockMoviesRepository.hardDelete.mockResolvedValue(mockMovie);

      const result = await service.hardDelete('1');

      expect(result.id).toBe('1');
      expect(mockMoviesRepository.hardDelete).toHaveBeenCalledWith('1');
    });
  });
});
