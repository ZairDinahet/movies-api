import { IsOptional, IsEmail } from 'class-validator';

export enum UserOrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetUsersFilterDto {
  @IsOptional()
  @IsEmail()
  email?: string;
}
