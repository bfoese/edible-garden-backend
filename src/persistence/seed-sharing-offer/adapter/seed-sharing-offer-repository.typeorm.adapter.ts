import { SeedSharingOffer } from '@eg-domain/seed-sharing-offer/seed-sharing-offer';
import { SeedSharingOfferRepository } from '@eg-domain/seed-sharing-offer/seed-sharing-offer-repository.interface';
import { UniqueConstraintViolation } from '@eg-persistence/shared/unique-constraint-violation';
import { UniqueConstraintViolationFactory } from '@eg-persistence/shared/unique-constraint-violation.extractor';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { DeleteResult } from 'typeorm';

import { SeedSharingOfferTypeOrmRepository } from '../repository/seed-sharing-offer.typeorm-repository';
import { SeedSharingOfferSchema } from '../schema/seed-sharing-offer.schema';

@Injectable()
export class SeedSharingOfferRepositoryTypeOrmAdapter implements SeedSharingOfferRepository {
  private readonly plainToClass: (user: SeedSharingOffer) => SeedSharingOffer = (offer) =>
    plainToClass(SeedSharingOffer, offer);

  public constructor(private readonly offerRepository: SeedSharingOfferTypeOrmRepository) {}

  public create(offer: SeedSharingOffer): Promise<SeedSharingOffer | UniqueConstraintViolation<SeedSharingOffer>> {
    return this.offerRepository
      .save(offer)
      .then(this.plainToClass)
      .catch((error) => {
        const violatedUniqueConstraint = UniqueConstraintViolationFactory.getUniqueConstraintViolationOrNull(
          error,
          SeedSharingOfferSchema,
          offer
        );

        if (violatedUniqueConstraint) {
          return violatedUniqueConstraint;
        } else throw error;
      });
  }

  public save(offer: SeedSharingOffer): Promise<SeedSharingOffer | UniqueConstraintViolation<SeedSharingOffer>> {
    return this.offerRepository
      .save(offer)
      .then(this.plainToClass)
      .catch((error) => {
        const violatedUniqueConstraint = UniqueConstraintViolationFactory.getUniqueConstraintViolationOrNull(
          error,
          SeedSharingOfferSchema,
          offer
        );

        if (violatedUniqueConstraint) {
          return violatedUniqueConstraint;
        } else throw error;
      });
  }

  /**
   * Important: based on the provided offer object ONE or MANY offers might be
   * deleted.
   * @param user - This acts as a pattern of where conditions to find matching
   * offers. If you want do delete a single specific offer, you need to provide fields
   * which are unique within the offer schema.
   * @returns Number of deleted rows
   */
  public delete(offer: SeedSharingOffer): Promise<number> {
    return this.offerRepository.delete(offer).then((result: DeleteResult) => result.affected ?? 0);
  }

  public findOne(id: string): Promise<SeedSharingOffer> {
    return this.offerRepository.findOneOrFail(id);
  }

  // TODO add paging
  public async findByUser(userId: string): Promise<SeedSharingOffer[]> {
    // if user data should be in result: user leftJoinAndSelect instead of leftJoin
    let qb = this.offerRepository
      .createQueryBuilder('seedSharingOffer')
      .leftJoin('seedSharingOffer.user', 'user', 'user.entityInfo.id=:userId')
      .setParameters({
        userId: userId,
      });

    qb = qb.printSql();

    // if (opts?.withDeleted) {
    //   qb = qb.withDeleted();
    // }
    return (await qb.getMany()).map((offer: SeedSharingOffer) => this.plainToClass(offer));
  }
}
