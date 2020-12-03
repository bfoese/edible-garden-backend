import { Test, TestingModule } from '@nestjs/testing';
import { BotanicalFamilyController } from './botanical-family.controller';
import { BotanicalFamilyService } from './botanical-family.service';

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
