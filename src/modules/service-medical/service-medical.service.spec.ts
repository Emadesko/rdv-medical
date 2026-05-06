import { Test, TestingModule } from '@nestjs/testing';
import { ServiceMedicalService } from './service-medical.service';

describe('ServiceMedicalService', () => {
  let service: ServiceMedicalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceMedicalService],
    }).compile();

    service = module.get<ServiceMedicalService>(ServiceMedicalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
