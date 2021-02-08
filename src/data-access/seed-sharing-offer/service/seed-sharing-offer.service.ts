import { UniqueKeyConstraintViolationException } from '@eg-app/exception/unique-key-violation.exception';
import { ArrayUtils } from '@eg-common/util/array.utils';
import { SeedSharingOffer } from '@eg-domain/seed-sharing-offer/seed-sharing-offer';
import { SeedSharingOfferRepository } from '@eg-domain/seed-sharing-offer/seed-sharing-offer-repository.interface';
import { SeedSharingOfferValidation } from '@eg-domain/seed-sharing-offer/seed-sharing-offer-validation';
import { UniqueConstraintViolation } from '@eg-persistence/shared/unique-constraint-violation';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { validate, ValidationError } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const SeedSharingOfferRepo = () => Inject('SeedSharingOfferRepositoryTypeOrm');

@Injectable()
export class SeedSharingOfferService {
  public constructor(@SeedSharingOfferRepo() public readonly seedSharingOfferRepository: SeedSharingOfferRepository) {}

  public async create(seedSharingOffer: SeedSharingOffer): Promise<SeedSharingOffer> | never {
    const errors: ValidationError[] = await validate(seedSharingOffer, <ValidatorOptions>{
      groups: [SeedSharingOfferValidation.groups.createOffer],
    });

    if (!ArrayUtils.isEmpty(errors)) {
      throw new BadRequestException(errors);
    }

    return this.seedSharingOfferRepository
      .create(seedSharingOffer)
      .then((result: SeedSharingOffer | UniqueConstraintViolation) => {
        if (result instanceof UniqueConstraintViolation) {
          throw new UniqueKeyConstraintViolationException(result.constraintColumns);
        }
        return result;
      });
  }

  public async save(seedSharingOffer: SeedSharingOffer): Promise<SeedSharingOffer> | never {
    return this.seedSharingOfferRepository
      .save(seedSharingOffer)
      .then((result: SeedSharingOffer | UniqueConstraintViolation) => {
        if (result instanceof UniqueConstraintViolation) {
          throw new UniqueKeyConstraintViolationException(result.constraintColumns);
        }
        return result;
      });
  }
}
