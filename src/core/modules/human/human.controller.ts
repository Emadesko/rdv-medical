import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { HumanService } from './human.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RestResponse } from '../../dto/rest.response';
import { HumanMapper } from './mapper/human.mapper';
import { User } from '../user/entities/user.entity';

@Controller('humans')
export class HumanController {
  constructor(private readonly humanService: HumanService) {}

  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    return new RestResponse(
      HttpStatus.OK,
      HumanMapper.toDto(await this.humanService.getByUser(user)),
      'HumanResponse',
    );
  }
}
