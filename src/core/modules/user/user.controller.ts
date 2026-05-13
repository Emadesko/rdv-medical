import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { RestResponse } from '../../common/dto/responses/rest.response';
import { UserMapper } from './mapper/user.mapper';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PaginationRequest } from '../../common/dto/requests/pagination.request';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return new RestResponse(
      HttpStatus.CREATED,
      UserMapper.toDto(await this.userService.creation(createUserDto)),
      'UserResponse',
    );
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Query() pagination: PaginationRequest) {
    const result = await this.userService.findAllPaginated(pagination);
    return new RestResponse(
      HttpStatus.CREATED,
      {
        users: result.data,
      },
      'UserResponse',
      result.pagination,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updating(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
