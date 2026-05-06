import { Injectable } from '@nestjs/common';
import { CreateServiceMedicalDto } from './dto/create-service-medical.dto';
import { UpdateServiceMedicalDto } from './dto/update-service-medical.dto';

@Injectable()
export class ServiceMedicalService {
  create(createServiceMedicalDto: CreateServiceMedicalDto) {
    return 'This action adds a new serviceMedical';
  }

  findAll() {
    return `This action returns all serviceMedical`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceMedical`;
  }

  update(id: number, updateServiceMedicalDto: UpdateServiceMedicalDto) {
    return `This action updates a #${id} serviceMedical`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceMedical`;
  }
}
