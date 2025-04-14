import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UserDto } from './dto/user.dto';
import { Prisma, User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const createdUser = await this.usersRepository.create(createUserDto);

    return plainToInstance(UserDto, createdUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(filterDto: GetUsersFilterDto): Promise<UserDto[]> {
    const { email, orderByCreatedAt } = filterDto;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (email) {
      where.email = email;
    }

    const orderBy: Prisma.UserOrderByWithRelationInput | undefined =
      orderByCreatedAt
        ? { createdAt: orderByCreatedAt.toLowerCase() as 'asc' | 'desc' }
        : undefined;

    const users = await this.usersRepository.findAll({ where, orderBy });
    const result = plainToInstance(UserDto, users, {
      excludeExtraneousValues: true,
    });
    return result;
  }

  async findOne(id: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new ConflictException('User not found');
    }
    return plainToInstance(UserDto, user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new ConflictException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    await this.findOne(id);
    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    return plainToInstance(UserDto, updatedUser);
  }

  async softDelete(id: string): Promise<UserDto> {
    await this.findOne(id);
    const updatedUser = await this.usersRepository.softDelete(id);
    return plainToInstance(UserDto, updatedUser);
  }

  async hardDelete(id: string): Promise<UserDto> {
    await this.findOne(id);
    const deletedUser = await this.usersRepository.hardDelete(id);
    return plainToInstance(UserDto, deletedUser);
  }
}
