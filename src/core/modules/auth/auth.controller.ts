import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/requests/login.dto';
import type { Response } from 'express';
import { RestResponse } from '../../dto/rest.response';
import { AuthResponse } from './dto/responses/auth.response';
import { JwtGuard } from './guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { UserMapper } from '../user/mapper/user.mapper';
import { HumanService } from '../human/human.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { PayloadInterface } from './dto/responses/payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly humanService: HumanService,
  ) {}

  @Post('login')
  async login(
    @Body() request: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      request.email,
      request.password,
    );

    res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME!, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE),
    });

    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME!, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
    });
    return new RestResponse(
      HttpStatus.OK,
      new AuthResponse(null),
      'AuthResponse',
    );
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(
    @CurrentUser() user: PayloadInterface,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = this.authService.refresh(user);

    res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME!, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE),
    });

    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME!, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
    });

    return new RestResponse(HttpStatus.OK, null, 'Token renouvelé');
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: User) {
    return new RestResponse(
      HttpStatus.OK,
      UserMapper.toDtoConnected(user, await this.humanService.getByUser(user)),
      'UserConnected',
    );
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME!);
    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME!);
    return new RestResponse(HttpStatus.OK, null, 'Déconnecté');
  }
}
