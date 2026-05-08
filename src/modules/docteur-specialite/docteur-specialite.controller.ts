import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocteurSpecialiteService } from './docteur-specialite.service';
import { CreateDocteurSpecialiteDto } from './dto/create-docteur-specialite.dto';
import { UpdateDocteurSpecialiteDto } from './dto/update-docteur-specialite.dto';

@Controller('docteur-specialite')
export class DocteurSpecialiteController {
  constructor(private readonly docteurSpecialiteService: DocteurSpecialiteService) {}

  @Post()
  create(@Body() createDocteurSpecialiteDto: CreateDocteurSpecialiteDto) {
    return this.docteurSpecialiteService.create(createDocteurSpecialiteDto);
  }

  @Get()
  findAll() {
    return this.docteurSpecialiteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docteurSpecialiteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocteurSpecialiteDto: UpdateDocteurSpecialiteDto) {
    return this.docteurSpecialiteService.update(+id, updateDocteurSpecialiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docteurSpecialiteService.remove(+id);
  }
}
