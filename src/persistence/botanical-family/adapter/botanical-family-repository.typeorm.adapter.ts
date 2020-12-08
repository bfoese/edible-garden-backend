import { Injectable } from '@nestjs/common';
import { BotanicalFamilyEntity } from 'src/types-persistence/botanical-family/botanical-family-entity.interface';
import { BotanicalFamilyRepository } from 'src/types-persistence/botanical-family/botanical-family-repository.interface';
import { UpdateResult } from 'typeorm';
import { BotanicalFamilyTypeOrmRepository } from '../repository/botanical-family.typeorm.repository';

@Injectable()
export class BotanicalFamilyRepositoryTypeOrmAdapter implements BotanicalFamilyRepository {
  public constructor(private readonly botanicalFamilyRepository: BotanicalFamilyTypeOrmRepository) {}

  public create(entity: Partial<BotanicalFamilyEntity>): Promise<BotanicalFamilyEntity> {
    return this.botanicalFamilyRepository.save(entity);
  }
  public save(entity: Partial<BotanicalFamilyEntity>): Promise<BotanicalFamilyEntity> {
    return this.botanicalFamilyRepository.save(entity);
  }
  public findOne(id: string): Promise<BotanicalFamilyEntity> {
    return this.botanicalFamilyRepository.findOneOrFail(id);
  }
  public findAll(): Promise<BotanicalFamilyEntity[]> {
    return this.botanicalFamilyRepository.find();
  }
  public delete(id: string): Promise<boolean> {
    return this.botanicalFamilyRepository.delete(id).then((result: UpdateResult) => result?.affected > 0);
  }
  public softDelete(id: string): Promise<boolean> {
    return this.botanicalFamilyRepository.softDelete(id).then((result: UpdateResult) => result?.affected > 0);
  }
  public recover(id: string): Promise<boolean> {
    return this.botanicalFamilyRepository.restore(id).then((result: UpdateResult) => result?.affected > 0);
  }
}
