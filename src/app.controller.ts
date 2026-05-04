import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<string | null> {
    return this.appService.getHello();
  }

  @Get('set')
  setHello(): Promise<void> {
    return this.appService.setHello();
  }
}
