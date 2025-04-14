import { PartialType } from '@nestjs/swagger'; // cambia esto
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
