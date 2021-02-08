import { UniqueConstraintViolation } from '@eg-persistence/shared/unique-constraint-violation';

import { SeedSharingOffer } from './seed-sharing-offer';

export interface SeedSharingOfferRepository {
  create(user: SeedSharingOffer): Promise<SeedSharingOffer | UniqueConstraintViolation>;
  save(offer: SeedSharingOffer): Promise<SeedSharingOffer | UniqueConstraintViolation>;

  /**
   * Important: based on the provided object ONE or MANY offers might be
   * deleted.
   * @param offer - This acts as a pattern of where conditions to find matching
   * offers. If you want do delete a single specific offer, you need to provide fields
   * which are unique within the offer schema.
   * @returns Number of deleted rows
   */
  delete(offer: SeedSharingOffer): Promise<number>;

  findOne(id: string): Promise<SeedSharingOffer>;

  // TODO add paging
  findByUser(userId: string): Promise<SeedSharingOffer[]>;
}
