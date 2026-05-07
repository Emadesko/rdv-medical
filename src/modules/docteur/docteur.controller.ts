import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocteurService } from './docteur.service';
import { UpdateDocteurDto } from './dto/update-docteur.dto';

@Controller('docteurs')
export class DocteurController {
  constructor(private readonly docteurService: DocteurService) {}

  // @Post()
  // create(@Body() createDocteurDto: CreateDocteurDto) {
  //   return this.docteurService.create(createDocteurDto);
  // }

  @Get()
  findAll() {
    return this.docteurService.findAll();
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
  remove(@Param('id') id: string) {
    return this.docteurService.remove(+id);
  }
}
