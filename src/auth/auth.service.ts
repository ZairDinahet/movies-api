import {
  UnauthorizedException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
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
import { TokenDto } from './dto/token.dto';

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
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginInfo: LoginDto): Promise<TokenDto> {
    const user = await this.validateUser(loginInfo);
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    const { password, ...rest } = registerDto;

    const hashedPassword = await hashPassword(password);
    const createdUser = await this.usersService.create({
      password: hashedPassword,
      role: 'USER',
      ...rest,
    });

    return plainToInstance(UserDto, createdUser, {
      excludeExtraneousValues: true,
    });
  }

  async refreshTokens(user: JwtPayload): Promise<string> {
    return await this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    try {
      console.log(
        'ACCES-TOKEN EXPIRE',
        this.configService.get('JWT_EXPIRATION_TIME'),
      );
      console.log('ACCES-TOKEN', this.configService.get('JWT_SECRET'));

      return await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      });
    } catch (e) {
      console.error('Error generating access token:', e);
      throw new InternalServerErrorException('Failed to generate access token');
    }
  }

  private async generateRefreshToken(payload: JwtPayload): Promise<string> {
    try {
      console.log(
        'REFRESH-TOKEN EXPIRE',
        this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
      );
      console.log(
        'REFRESH-TOKEN',
        this.configService.get('JWT_REFRESH_SECRET'),
      );

      return await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
      });
    } catch (e) {
      console.error('Error generating refresh token:', e);
      throw new InternalServerErrorException(
        'Failed to generate refresh token',
      );
    }
  }
}
