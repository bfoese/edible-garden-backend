import { GrowingManual } from './growing-manual';

export interface GrowingManualRepository {
  findOne(id: string): Promise<GrowingManual>;
  findAll(): Promise<GrowingManual[]>;
}
