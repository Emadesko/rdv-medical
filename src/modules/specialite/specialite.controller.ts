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
import { SpecialiteService } from './specialite.service';
import { CreateSpecialiteDto } from './dto/requests/create-specialite.dto';
import { UpdateSpecialiteDto } from './dto/requests/update-specialite.dto';
import { RestResponse } from '../../core/common/dto/responses/rest.response';
import { SpecialiteMapper } from './mapper/specialite.mapper';
import { JwtGuard } from '../../core/modules/auth/guards/jwt.guard';
import { PaginationRequest } from '../../core/common/dto/requests/pagination.request';

@UseGuards(JwtGuard)
@Controller('specialites')
export class SpecialiteController {
  constructor(private readonly specialiteService: SpecialiteService) {}

  @Post()
  async create(@Body() createSpecialiteDto: CreateSpecialiteDto) {
    return new RestResponse(
      HttpStatus.CREATED,
      SpecialiteMapper.toDto(
        await this.specialiteService.creation(createSpecialiteDto),
      ),
      'SpecialiteDto',
    );
  }

  @Get()
  async findAll(@Query() pagination: PaginationRequest) {
    const result = await this.specialiteService.findAllPaginated(pagination);
    return new RestResponse(
      HttpStatus.OK,
      result.data.map(SpecialiteMapper.toDto),
      'SpecialiteDto',
      result.pagination,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialiteService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpecialiteDto: UpdateSpecialiteDto,
  ) {
    return this.specialiteService.updating(+id, updateSpecialiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialiteService.remove(+id);
  }
}
