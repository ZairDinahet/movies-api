import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { UserDto } from 'src/users/dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { AuthenticatedRequest } from './interfaces/authenticated-user.interface';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'User login (PUBLIC)' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 409, description: 'Invalid credentials' })
  @Post('login')
  async login(
    @Body() loginInfo: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(loginInfo);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return { accessToken: tokens.accessToken };
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/auth/refresh',
    });
    return { message: 'Logout successful' };
  }

  @Public()
  @HttpCode(201)
  @ApiOperation({ summary: 'Register new user (PUBLIC)' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: UserDto,
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Post('register')
  async register(@Body() registerInfo: RegisterDto) {
    return this.authService.register(registerInfo);
  }

  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshToken(@Req() req: AuthenticatedRequest) {
    const token = await this.authService.refreshTokens(req.user);
    return { accessToken: token };
  }
}
