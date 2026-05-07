import { Injectable } from '@nestjs/common';
import { UpdateDocteurDto } from './dto/update-docteur.dto';
import { Docteur } from './entities/docteur.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../core/modules/user/entities/user.entity';
import { NotFoundException } from '../../core/utils/exceptions/not-found.exception';
import { GenericService } from '../../core/common/services/generic.service';

@Injectable()
export class DocteurService extends GenericService<Docteur> {
  constructor(
    @InjectRepository(Docteur) protected readonly repo: Repository<Docteur>,
  ) {
    super(repo, 'Aucun docteur ne correspond a cet identifiant');
  }

  updating(id: number, updateDocteurDto: UpdateDocteurDto) {
    return `This action updates a #${id} docteur`;
  }

  async getByUser(user: User): Promise<Docteur> {
    const doc = await this.repo.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });

    if (!doc) {
      throw new NotFoundException(
        "Aucun docteur n'est lié à ce compte utilisateur",
      );
    }

    return doc;
  }
}
