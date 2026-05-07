import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { SpecialiteService } from './specialite.service';
import { CreateSpecialiteDto } from './dto/requests/create-specialite.dto';
import { UpdateSpecialiteDto } from './dto/requests/update-specialite.dto';
import { RestResponse } from '../../core/common/dto/responses/rest.response';
import { SpecialiteMapper } from './mapper/specialite.mapper';

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
  findAll() {
    return this.specialiteService.findAll();
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
