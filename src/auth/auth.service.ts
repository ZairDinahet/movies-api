import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { hashPassword, comparePasswords } from '../common/helpers/hash.helper';
import { plainToInstance } from 'class-transformer';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(loginInfo: LoginDto): Promise<User> {
    const { email, password } = loginInfo;

    const user = await this.usersService.findByEmail(email);

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid credentials');
    }

    return user;
  }

  async login(loginInfo: LoginDto) {
    const user = await this.validateUser(loginInfo);
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    const { password, ...rest } = registerDto;

    const hashedPassword = await hashPassword(password);

    const createdUser = await this.usersService.create({
      password: hashedPassword,
      ...rest,
    });
    return plainToInstance(UserDto, createdUser, {
      excludeExtraneousValues: true,
    });
  }

  async refreshTokens(user: User) {
    const newAccessToken: string = await this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return newAccessToken;
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });
  }

  private async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }
}
