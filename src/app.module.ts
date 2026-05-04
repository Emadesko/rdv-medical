import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from './common/redis/redis.service';
import dbConfig from './config/dbConfig';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dbConfig()),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
  exports: [RedisService],
})
export class AppModule {}
