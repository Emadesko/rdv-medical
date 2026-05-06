import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreneauService } from './creneau.service';
import { CreateCreneauDto } from './dto/create-creneau.dto';
import { UpdateCreneauDto } from './dto/update-creneau.dto';

@Controller('creneau')
export class CreneauController {
  constructor(private readonly creneauService: CreneauService) {}

  @Post()
  create(@Body() createCreneauDto: CreateCreneauDto) {
    return this.creneauService.create(createCreneauDto);
  }

  @Get()
  findAll() {
    return this.creneauService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creneauService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreneauDto: UpdateCreneauDto) {
    return this.creneauService.update(+id, updateCreneauDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creneauService.remove(+id);
  }
}
