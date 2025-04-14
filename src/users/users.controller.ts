import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() filterDto: GetUsersFilterDto): Promise<UserDto[]> {
    return this.usersService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto | null> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id/soft')
  async softDelete(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }

  @Delete(':id/hard')
  async hardDelete(@Param('id') id: string) {
    return this.usersService.hardDelete(id);
  }
}
