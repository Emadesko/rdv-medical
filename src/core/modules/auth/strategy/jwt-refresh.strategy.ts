import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserRole } from '../../user/enums/user.role';
import { PayloadInterface } from '../dto/responses/payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          req?.cookies?.[process.env.REFRESH_TOKEN_COOKIE_NAME!] ?? null,
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
      ignoreExpiration: false,
    });
  }

  validate(payload: {
    sub: number;
    email: string;
    role: UserRole;
  }): PayloadInterface {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
