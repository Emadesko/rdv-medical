import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwtConfig';
import { JwtStrategy } from './strategy/jwt.strategy';
import { HumanModule } from '../human/human.module';

@Module({
  imports: [
    HumanModule,
    UserModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
