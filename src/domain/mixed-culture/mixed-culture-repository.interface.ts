import { MixedCulture } from './mixed-culture';

export interface MixedCultureRepository {
  findAll(): Promise<MixedCulture[]>;
}
