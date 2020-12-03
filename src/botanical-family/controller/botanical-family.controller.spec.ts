import { Test, TestingModule } from '@nestjs/testing';
import { BotanicalFamilyService } from '../service/botanical-family.service';
import { BotanicalFamilyController } from './botanical-family.controller';

describe('BotanicalFamilyController', () => {
  let controller: BotanicalFamilyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotanicalFamilyController],
      providers: [BotanicalFamilyService],
    }).compile();

    controller = module.get<BotanicalFamilyController>(
      BotanicalFamilyController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
