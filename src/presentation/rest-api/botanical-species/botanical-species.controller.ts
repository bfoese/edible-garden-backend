import { BotanicalSpeciesInfoFacadeService } from '@eg-presentation-facade/botanical-species-info/botanical-species-info-facade.service';
import { BotanicalSpeciesInfoDto } from '@eg-presentation-facade/botanical-species-info/dto/botanical-species-info.dto';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Botanical Species')
@Controller('v1/botanical-species-info')
export class BotanicalSpeciesInfoController {
  public constructor(private readonly botanicalSpeciesInfoFacadeService: BotanicalSpeciesInfoFacadeService) {}

  @Get()
  public findAll(): Promise<BotanicalSpeciesInfoDto[]> {
    return this.botanicalSpeciesInfoFacadeService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<BotanicalSpeciesInfoDto> {
    return this.botanicalSpeciesInfoFacadeService.findOne(id);
  }
}
