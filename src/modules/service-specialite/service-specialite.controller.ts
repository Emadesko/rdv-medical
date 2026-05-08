import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceSpecialiteService } from './service-specialite.service';
import { CreateServiceSpecialiteDto } from './dto/create-service-specialite.dto';
import { UpdateServiceSpecialiteDto } from './dto/update-service-specialite.dto';

@Controller('service-specialite')
export class ServiceSpecialiteController {
  constructor(private readonly serviceSpecialiteService: ServiceSpecialiteService) {}

  @Post()
  create(@Body() createServiceSpecialiteDto: CreateServiceSpecialiteDto) {
    return this.serviceSpecialiteService.create(createServiceSpecialiteDto);
  }

  @Get()
  findAll() {
    return this.serviceSpecialiteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceSpecialiteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceSpecialiteDto: UpdateServiceSpecialiteDto) {
    return this.serviceSpecialiteService.update(+id, updateServiceSpecialiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceSpecialiteService.remove(+id);
  }
}
