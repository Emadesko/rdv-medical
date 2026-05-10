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
import { ServiceMedicalService } from '../service-medical/service-medical.service';
import { ServiceMedicalMapper } from '../service-medical/mapper/service-medical.mapper';

@UseGuards(JwtGuard)
@Controller('specialites')
export class SpecialiteController {
  constructor(
    private readonly specialiteService: SpecialiteService,
    private readonly serviceMedicalService: ServiceMedicalService,
  ) {}

  @Get('create')
  async getCreationDatas(@Query('nom') nom: string) {
    return new RestResponse(
      HttpStatus.OK,
      (await this.serviceMedicalService.findAllByNom(nom)).map(
        ServiceMedicalMapper.toDto,
      ),
      'ServiceMedicalDto',
    );
  }

  @Post()
  async create(@Body() createSpecialiteDto: CreateSpecialiteDto) {
    return new RestResponse(
      HttpStatus.CREATED,
      SpecialiteMapper.toDtoDetail(
        await this.specialiteService.creation(createSpecialiteDto),
      ),
      'SpecialiteDetailDto',
    );
  }

  @Get()
  async findAll(@Query() pagination: PaginationRequest) {
    const result = await this.specialiteService.findAllPaginated(pagination);
    return new RestResponse(
      HttpStatus.OK,
      result.data.map(SpecialiteMapper.toDtoDetail),
      'SpecialiteDetailDto',
      result.pagination,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialiteService.findOne(+id);
  }

  @Get(':id/update')
  async getUpdateDatas(@Param('id') id: number, @Query('nom') nom: string) {
    return new RestResponse(
      HttpStatus.OK,
      (await this.specialiteService.getUpdateDatas(+id, nom)).map(
        ServiceMedicalMapper.toDto,
      ),
      'ServiceMedicalDto',
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSpecialiteDto: UpdateSpecialiteDto,
  ) {
    return new RestResponse(
      HttpStatus.ACCEPTED,
      SpecialiteMapper.toDtoDetail(
        await this.specialiteService.updating(+id, updateSpecialiteDto),
      ),
      'SpecialiteDetailDto',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.specialiteService.findOne(+id);
    await this.specialiteService.remove(+id);
    return new RestResponse(
      HttpStatus.OK,
      'Spécialité supprimée avec succès',
      '',
    );
  }
}
