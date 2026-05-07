import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { StringValue } from 'ms';

export const jwtAccessConfig = registerAs(
  'jwtAccess',
  (): JwtSignOptions => ({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN as StringValue,
  }),
);

export const jwtRefreshConfig = registerAs(
  'jwtRefresh',
  (): JwtSignOptions => ({
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as StringValue,
  }),
);
