import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RdvService } from './rdv.service';
import { CreateRdvDto } from './dto/create-rdv.dto';
import { UpdateRdvDto } from './dto/update-rdv.dto';

@Controller('rdv')
export class RdvController {
  constructor(private readonly rdvService: RdvService) {}

  @Post()
  create(@Body() createRdvDto: CreateRdvDto) {
    return this.rdvService.create(createRdvDto);
  }

  @Get()
  findAll() {
    return this.rdvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rdvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRdvDto: UpdateRdvDto) {
    return this.rdvService.update(+id, updateRdvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rdvService.remove(+id);
  }
}
