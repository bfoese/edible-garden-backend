import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BotanicalFamilyEntityRepository } from 'src/botanical-family/botanical-family-data/repository/botanical-family.repository';
import { CreateBotanicalFamilyDto } from '../dto/create-botanical-family.dto';
import { UpdateBotanicalFamilyDto } from '../dto/update-botanical-family.dto';
import { BotanicalFamilyMapper } from '../mapper/botanical-family.mapper';

@Injectable()
export class BotanicalFamilyService {
  private readonly botanicalFamilyMapper = new BotanicalFamilyMapper();

  constructor(
    @InjectRepository(BotanicalFamilyEntityRepository)
    private readonly botanicalFamilyRepository: BotanicalFamilyEntityRepository,
  ) {}

  create(createBotanicalFamilyDto: CreateBotanicalFamilyDto) {
    return 'This action adds a new botanicalFamily';
  }

  findAll() {
    // this.botanicalFamilyRepository.find()
    return `This action returns all botanicalFamily`;
  }

  findOne(id: number) {
    return `This action returns a #${id} botanicalFamily`;
  }

  update(id: number, updateBotanicalFamilyDto: UpdateBotanicalFamilyDto) {
    return `This action updates a #${id} botanicalFamily`;
  }

  remove(id: number) {
    return `This action removes a #${id} botanicalFamily`;
  }
}
