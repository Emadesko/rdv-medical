import { Test, TestingModule } from '@nestjs/testing';
import { CreneauService } from './creneau.service';

describe('CreneauService', () => {
  let service: CreneauService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreneauService],
    }).compile();

    service = module.get<CreneauService>(CreneauService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
