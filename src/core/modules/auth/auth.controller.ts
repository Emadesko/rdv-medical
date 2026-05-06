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
    const token = await this.authService.login(request.email, request.password);

    res.cookie(process.env.TOKEN_NAME!, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(process.env.MAX_AGE!),
    });
    return new RestResponse(
      HttpStatus.OK,
      new AuthResponse(token),
      'AuthResponse',
    );
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
    res.clearCookie(process.env.TOKEN_NAME!);
    return new RestResponse(HttpStatus.OK, 'Déconnexion', 'AuthResponse');
  }
}
