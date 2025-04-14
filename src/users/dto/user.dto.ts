import { IsString, IsEmail, IsEnum, IsUUID, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client'; // Asegúrate de importar el enum de Prisma
import { Exclude, Expose } from 'class-transformer'; // Importar Exclude de class-transformer

@Exclude() // Excluir la propiedad 'password' de la salida del DTO
export class UserDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty()
  @IsEmail()
  @Expose()
  email?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  lastName?: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  @Expose()
  role: Role;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsDate()
  @Expose()
  deletedAt?: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Expose()
  updatedAt: Date;

  password: string;
}
