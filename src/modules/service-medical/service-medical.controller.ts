import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceMedicalService } from './service-medical.service';
import { CreateServiceMedicalDto } from './dto/requests/create-service-medical.dto';
import { UpdateServiceMedicalDto } from './dto/requests/update-service-medical.dto';

@Controller('service-medicals')
export class ServiceMedicalController {
  constructor(private readonly serviceMedicalService: ServiceMedicalService) {}

  @Post()
  create(@Body() createServiceMedicalDto: CreateServiceMedicalDto) {
    return this.serviceMedicalService.creation(createServiceMedicalDto);
  }

  @Get()
  findAll() {
    return this.serviceMedicalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceMedicalService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceMedicalDto: UpdateServiceMedicalDto,
  ) {
    return this.serviceMedicalService.updating(+id, updateServiceMedicalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceMedicalService.remove(+id);
  }
}
