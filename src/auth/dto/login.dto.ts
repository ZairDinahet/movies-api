import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
