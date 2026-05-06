import { Injectable } from '@nestjs/common';
import { UpdateDocteurDto } from './dto/update-docteur.dto';
import { Docteur } from './entities/docteur.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../core/modules/user/entities/user.entity';
import { NotFoundException } from '../../core/utils/exceptions/not-found.exception';

@Injectable()
export class DocteurService {
  constructor(
    @InjectRepository(Docteur) private readonly repo: Repository<Docteur>,
  ) {}

  async create(docteur: Docteur) {
    return await this.repo.save(docteur);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  update(id: number, updateDocteurDto: UpdateDocteurDto) {
    return `This action updates a #${id} docteur`;
  }

  remove(id: number) {
    return `This action removes a #${id} docteur`;
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
