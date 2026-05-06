import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceMedicalService } from './service-medical.service';
import { CreateServiceMedicalDto } from './dto/create-service-medical.dto';
import { UpdateServiceMedicalDto } from './dto/update-service-medical.dto';

@Controller('service-medical')
export class ServiceMedicalController {
  constructor(private readonly serviceMedicalService: ServiceMedicalService) {}

  @Post()
  create(@Body() createServiceMedicalDto: CreateServiceMedicalDto) {
    return this.serviceMedicalService.create(createServiceMedicalDto);
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
  update(@Param('id') id: string, @Body() updateServiceMedicalDto: UpdateServiceMedicalDto) {
    return this.serviceMedicalService.update(+id, updateServiceMedicalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceMedicalService.remove(+id);
  }
}
