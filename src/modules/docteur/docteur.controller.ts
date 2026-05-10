import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { DocteurService } from './docteur.service';
import { UpdateDocteurDto } from './dto/update-docteur.dto';
import { PaginationRequest } from '../../core/common/dto/requests/pagination.request';
import { RestResponse } from '../../core/common/dto/responses/rest.response';
import { DocteurMapper } from './mapper/docteur.mapper';

@Controller('docteurs')
export class DocteurController {
  constructor(private readonly docteurService: DocteurService) {}

  // @Post()
  // create(@Body() createDocteurDto: CreateDocteurDto) {
  //   return this.docteurService.create(createDocteurDto);
  // }

  @Get()
  async findAll(@Query() pagination: PaginationRequest) {
    const result = await this.docteurService.findAllPaginated(pagination);
    return new RestResponse(
      HttpStatus.OK,
      result.data.map(DocteurMapper.toDto),
      'SpecialiteDetailDto',
      result.pagination,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docteurService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocteurDto: UpdateDocteurDto) {
    return this.docteurService.updating(+id, updateDocteurDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.docteurService.findOne(+id);
    await this.docteurService.remove(+id);
    return new RestResponse(
      HttpStatus.OK,
      'Spécialité supprimée avec succès',
      '',
    );
  }
}
