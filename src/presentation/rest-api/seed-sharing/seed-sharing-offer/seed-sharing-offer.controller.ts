import { SeedSharingOfferCreationDto } from '@eg-presentation-facade/seed-sharing-offer/dto/seed-sharing-offer-creation.dto';
import { SeedSharingOfferDto } from '@eg-presentation-facade/seed-sharing-offer/dto/seed-sharing-offer.dto';
import { SeedSharingOfferFacadeService } from '@eg-presentation-facade/seed-sharing-offer/seed-sharing-offer-facade.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('seed-sharing', 'Seed Sharing Offer')
@Controller('v1/seed-sharing/offer')
export class SeedSharingOfferController {
  public constructor(private readonly seedSharingOfferFacadeService: SeedSharingOfferFacadeService) {}

  @Post('create')
  public createOffer(@Body() dto: SeedSharingOfferCreationDto): Promise<SeedSharingOfferDto> {
    console.log(dto);
    return this.seedSharingOfferFacadeService.createOffer(null, dto);
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<SeedSharingOfferDto> {
    return this.seedSharingOfferFacadeService.findOne(id);
  }

  @Get('user/:userId')
  public findByUser(@Param('userId') userId: string): Promise<SeedSharingOfferDto[]> {
    return this.seedSharingOfferFacadeService.findByUser(userId);
  }
}
