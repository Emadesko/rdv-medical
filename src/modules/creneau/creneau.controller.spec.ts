import { Test, TestingModule } from '@nestjs/testing';
import { CreneauController } from './creneau.controller';
import { CreneauService } from './creneau.service';

describe('CreneauController', () => {
  let controller: CreneauController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreneauController],
      providers: [CreneauService],
    }).compile();

    controller = module.get<CreneauController>(CreneauController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
