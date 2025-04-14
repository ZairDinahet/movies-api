import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  password: 'hashedpass',
  firstName: 'Test',
  lastName: 'User',
  role: 'ADMIN',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockUsersRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  hardDelete: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user if email does not exist', async () => {
      mockUsersRepository.findAll.mockResolvedValue([]);
      mockUsersRepository.create.mockResolvedValue(mockUser);

      const result = await service.create({
        email: mockUser.email,
        password: mockUser.password,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
      } as CreateUserDto);

      expect(result).toMatchObject({ email: mockUser.email });
      expect(mockUsersRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if the email already exists', async () => {
      mockUsersRepository.findAll.mockResolvedValue([mockUser]);

      await expect(
        service.create({
          email: mockUser.email,
          password: mockUser.password,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
        } as CreateUserDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return users filtered by email', async () => {
      mockUsersRepository.findAll.mockResolvedValue([mockUser]);

      const result = await service.findAll({ email: mockUser.email });

      expect(result).toHaveLength(1);
      expect(mockUsersRepository.findAll).toHaveBeenCalledWith({
        where: { deletedAt: null, email: mockUser.email },
      });
    });
  });

  describe('findOne', () => {
    it('should return the user if it exists', async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toMatchObject({ email: mockUser.email });
    });

    it('should throw NotFoundException if the user does not exist', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('not-exist')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user if it exists', async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);
      mockUsersRepository.update.mockResolvedValue({
        ...mockUser,
        firstName: 'Updated First Name',
        lastName: 'Updated Last Name',
      });

      const result = await service.update('1', {
        firstName: 'Updated First Name',
        lastName: 'Updated Last Name',
      } as UpdateUserDto);

      expect(result.firstName).toBe('Updated First Name');
      expect(result.lastName).toBe('Updated Last Name');
      expect(mockUsersRepository.update).toHaveBeenCalledWith('1', {
        firstName: 'Updated First Name',
        lastName: 'Updated Last Name',
      });
    });
  });

  describe('softDelete', () => {
    it('should soft delete the user', async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);
      mockUsersRepository.softDelete.mockResolvedValue({
        ...mockUser,
        deletedAt: new Date(),
      });

      const result = await service.softDelete('1');
      expect(result.deletedAt).not.toBeNull();
    });
  });

  describe('hardDelete', () => {
    it('should permanently delete the user', async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);
      mockUsersRepository.hardDelete.mockResolvedValue(mockUser);

      const result = await service.hardDelete('1');
      expect(result.id).toBe('1');
      expect(mockUsersRepository.hardDelete).toHaveBeenCalledWith('1');
    });
  });
});
