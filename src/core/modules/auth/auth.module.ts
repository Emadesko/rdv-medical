import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtAccessConfig, jwtRefreshConfig } from './config/jwtConfig';
import { JwtStrategy } from './strategy/jwt.strategy';
import { HumanModule } from '../human/human.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';

@Module({
  imports: [
    HumanModule,
    UserModule,
    ConfigModule.forFeature(jwtAccessConfig),
    ConfigModule.forFeature(jwtRefreshConfig),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwtAccess.secret'),
        signOptions: { expiresIn: config.get('jwtAccess.expiresIn') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
