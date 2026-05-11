import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreneauService } from './creneau.service';
import { CreateCreneauDto } from './dto/create-creneau.dto';
import { UpdateCreneauDto } from './dto/update-creneau.dto';
import { CurrentUser } from '../../core/modules/auth/decorators/current-user.decorator';
import { User } from '../../core/modules/user/entities/user.entity';
import { DocteurService } from '../docteur/docteur.service';
import { RestResponse } from '../../core/common/dto/responses/rest.response';
import { CreneauMapper } from './mapper/creneau.mapper';
import { JwtGuard } from '../../core/modules/auth/guards/jwt.guard';
import { RolesGuard } from '../../core/modules/auth/guards/roles.guard';
import { Roles } from '../../core/modules/auth/decorators/roles.decorator';
import { UserRole } from '../../core/modules/user/enums/user.role';

@Controller('creneaux')
export class CreneauController {
  constructor(
    private readonly creneauService: CreneauService,
    private readonly docteurService: DocteurService,
  ) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MEDECIN)
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createCreneauDto: CreateCreneauDto,
  ) {
    await this.creneauService.creation(
      await this.docteurService.getByUser(user),
      createCreneauDto,
    );
    return new RestResponse(
      HttpStatus.CREATED,
      'Créneaux générés avec succès',
      '',
    );
  }

  @Get()
  findAll() {
    return this.creneauService.findAll();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MEDECIN)
  @Get('agenda')
  async findAgendaCreneaux(
    @CurrentUser() user: User,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    const docteur = await this.docteurService.getByUser(user);
    return new RestResponse(
      HttpStatus.OK,
      (await this.creneauService.findAgendaByDocteur(docteur, start, end)).map(
        CreneauMapper.toDto,
      ),
      'CreneauDto',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creneauService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreneauDto: UpdateCreneauDto) {
    return this.creneauService.updating(+id, updateCreneauDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creneauService.remove(+id);
  }
}
