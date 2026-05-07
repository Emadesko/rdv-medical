import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { StringValue } from 'ms';
import { PayloadInterface } from './dto/responses/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    return user;
  }

  generateTokens(payload: { sub: number; email: string; role: string }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN as StringValue,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as StringValue,
    });

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  refresh(user: PayloadInterface) {
    return this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
