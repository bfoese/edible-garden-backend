import { CultivationPrinciple } from '@eg-domain-constants/cultivation-principle.enum';
import { ShareableReproductiveMaterial } from '@eg-domain-constants/shareable-reproductive-material.enum';
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { Address } from '@eg-domain/shared/adress';
import { EntityInfo } from '@eg-domain/shared/entity-info';
import { PhoneNumber } from '@eg-domain/shared/phone-number';
import { User } from '@eg-domain/user/user';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { SeedSharingOfferValidation } from './seed-sharing-offer-validation';

export class SeedSharingOffer {

  public constructor() {
    this.entityInfo = new EntityInfo();
  }

  @Type(() => EntityInfo)
  public entityInfo: EntityInfo;

  /**
   * User which created the offer
   */
  @IsNotEmpty({
    groups: [SeedSharingOfferValidation.groups.createOffer],
  })
  @Type(() => User)
  public user: User;

  @IsNotEmpty({
    groups: [SeedSharingOfferValidation.groups.createOffer],
  })
  public shareableReproductiveMaterial: ShareableReproductiveMaterial;

  public cultivationPrinciple: CultivationPrinciple;

  @IsNotEmpty({
    groups: [SeedSharingOfferValidation.groups.createOffer],
  })
  public botanicalNode: BotanicalNode;

  /**
   * Sortenbezeichung
   *
   * For example, the full cultivar name of the King Edward potato is Solanum
   * tuberosum 'King Edward'. 'King Edward' is the cultivar epithet, which,
   * according to the Rules of the Cultivated Plant Code, is bounded by single
   * quotation marks.
   */
  public cultivarEpithet: string;

  @Type(() => PhoneNumber)
  public phoneNumber: PhoneNumber;

  @IsNotEmpty({
    groups: [SeedSharingOfferValidation.groups.createOffer],
  })
  @Type(() => Address)
  public address: Address;

  public description: string;
}
