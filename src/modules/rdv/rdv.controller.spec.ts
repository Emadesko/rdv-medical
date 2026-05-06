import { Test, TestingModule } from '@nestjs/testing';
import { RdvController } from './rdv.controller';
import { RdvService } from './rdv.service';

describe('RdvController', () => {
  let controller: RdvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RdvController],
      providers: [RdvService],
    }).compile();

    controller = module.get<RdvController>(RdvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
