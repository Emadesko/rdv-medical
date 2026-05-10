import { Injectable } from '@nestjs/common';
import { FindOptionsOrder, Repository } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';
import { NotFoundException } from '../../utils/exceptions/not-found.exception';
import { PaginationRequest } from '../dto/requests/pagination.request';
import { PaginationResponse } from '../dto/responses/rest.response';

@Injectable()
export abstract class GenericService<T extends AbstractEntity> {
  protected constructor(
    protected readonly repo: Repository<T>,
    protected notFoundMessage: string,
  ) {}

  async create(entity: T): Promise<T> {
    return await this.repo.save(entity);
  }

  async findAll(): Promise<T[]> {
    return await this.repo.find({ order: { id: -1 } as any });
  }

  async findAllPaginated(paginationDto: PaginationRequest): Promise<{
    data: T[];
    pagination: PaginationResponse;
  }> {
    const { page, size } = paginationDto;

    const [data, total] = await this.repo.findAndCount({
      skip: page * size,
      take: size,
      order: { id: 'DESC' } as FindOptionsOrder<T>,
    });

    return {
      data,
      pagination: new PaginationResponse(total, size, page),
    };
  }

  async findOne(id: number): Promise<T> {
    const entity = await this.repo.findOne({
      where: { id } as any,
    });

    if (!entity) throw new NotFoundException(this.notFoundMessage);
    return entity;
  }

  async update(entity: T): Promise<T> {
    return await this.repo.save(entity);
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
