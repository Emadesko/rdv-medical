import { Injectable } from '@nestjs/common';
import { RedisService } from './common/redis/redis.service';

@Injectable()
export class AppService {
  constructor(private redisService: RedisService) {}
  async getHello(): Promise<string | null> {
    return await this.redisService.get('nom');
  }

  async setHello(): Promise<void> {
    await this.redisService.set('nom', 'edem', 20);
  }
}
