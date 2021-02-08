import { SeedSharingOfferService } from '@eg-data-access/seed-sharing-offer/service/seed-sharing-offer.service';
import { SeedSharingOffer } from '@eg-domain/seed-sharing-offer/seed-sharing-offer';
import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';

import { SeedSharingOfferCreationDto } from './dto/seed-sharing-offer-creation.dto';
import { SeedSharingOfferDto } from './dto/seed-sharing-offer.dto';
import { SeedSharingOfferCreationMapper } from './mapper/seed-sharing-offer-creation.mapper';
import { SeedSharingOfferMapper } from './mapper/seed-sharing-offer.mapper';

@Injectable()
export class SeedSharingOfferFacadeService {
  public constructor(
    private seedSharingOfferService: SeedSharingOfferService,
    private readonly seedSharingOfferMapper: SeedSharingOfferMapper,
    private readonly seedSharingOfferCreationMapper: SeedSharingOfferCreationMapper
  ) {}

  public createOffer(user: User, dto: SeedSharingOfferCreationDto): Promise<SeedSharingOfferDto> {
    const entity = this.seedSharingOfferCreationMapper.ontoEntity(dto, null);
    entity.user = new User();
    entity.user.entityInfo.id = user.entityInfo.id;
    return this.seedSharingOfferService
      .create(entity)
      .then((entity: SeedSharingOffer) => this.seedSharingOfferMapper.toDto(entity));
  }

  public findOne(id: string): Promise<SeedSharingOfferDto> {
    return this.seedSharingOfferService.seedSharingOfferRepository
      .findOne(id)
      .then((entity: SeedSharingOffer) => this.seedSharingOfferMapper.toDto(entity));
  }

  public findByUser(userId: string): Promise<SeedSharingOfferDto[]> {
    return this.seedSharingOfferService.seedSharingOfferRepository
      .findByUser(userId)
      .then((data: SeedSharingOffer[]) =>
        data.map((entity: SeedSharingOffer) => this.seedSharingOfferMapper.toDto(entity))
      );
  }
}
