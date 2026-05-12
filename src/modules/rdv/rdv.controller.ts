import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RdvService } from './rdv.service';
import { CreateRdvDto } from './dto/create-rdv.dto';
import { UpdateRdvDto } from './dto/update-rdv.dto';
import { RestResponse } from '../../core/common/dto/responses/rest.response';
import { JwtGuard } from '../../core/modules/auth/guards/jwt.guard';
import { CurrentUser } from '../../core/modules/auth/decorators/current-user.decorator';
import { User } from '../../core/modules/user/entities/user.entity';

@Controller('rdvs')
export class RdvController {
  constructor(private readonly rdvService: RdvService) {}

  @Get('create/etape1')
  async etape1() {
    const specialites = await this.rdvService.getSpecialites();
    return new RestResponse(HttpStatus.OK, specialites, 'SpecialiteDto');
  }

  @Get('create/etape2/:specialiteId')
  async etape2(@Param('specialiteId') specialiteId: number) {
    const medecins =
      await this.rdvService.getMedecinsBySpecialite(+specialiteId);
    return new RestResponse(HttpStatus.OK, medecins, 'DocteurDto');
  }

  @Get('create/etape3/:specialiteId')
  async etape3(@Param('specialiteId') specialiteId: number) {
    const services =
      await this.rdvService.getServicesBySpecialite(+specialiteId);
    return new RestResponse(HttpStatus.OK, services, 'ServiceMedicalDto');
  }

  @Get('create/etape4/:docteurId/jours')
  async etape4Jours(@Param('docteurId') docteurId: number) {
    const result = await this.rdvService.getJoursDisponibles(+docteurId);
    return new RestResponse(HttpStatus.OK, result, 'JoursDisponiblesDto');
  }

  @Get('create/etape4/:docteurId/creneaux')
  async etape4Creneaux(
    @Param('docteurId') docteurId: number,
    @Query('date') date: string, // 'YYYY-MM-DD'
  ) {
    const creneaux = await this.rdvService.getCreneauxByDocteurAndDate(
      +docteurId,
      date,
    );
    return new RestResponse(HttpStatus.OK, creneaux, 'CreneauDto');
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() dto: CreateRdvDto, @CurrentUser() user: User) {
    const rdv = await this.rdvService.creation(user, dto);
    return new RestResponse(HttpStatus.CREATED, rdv, 'RdvDto');
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
    return this.rdvService.updating(+id, updateRdvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rdvService.remove(+id);
  }
}
