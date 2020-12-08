import { BotanicalFamilyEntity } from './botanical-family-entity.interface';

export interface BotanicalFamilyRepository {
  create(entity: Partial<BotanicalFamilyEntity>): Promise<BotanicalFamilyEntity>;
  save(entity: Partial<BotanicalFamilyEntity>): Promise<BotanicalFamilyEntity>;

  findOne(id: string): Promise<BotanicalFamilyEntity>;
  findAll(): Promise<BotanicalFamilyEntity[]>;
  delete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
  recover(id: string): Promise<boolean>;
}
