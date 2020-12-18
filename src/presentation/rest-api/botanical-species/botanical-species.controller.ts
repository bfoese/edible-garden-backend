import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BotanicalSpeciesFacadeService } from 'src/presentation/facade/botanical-species/botanical-species-facade.service';
import { BotanicalSpeciesDto } from 'src/presentation/facade/botanical-species/dto/botanical-species.dto';

@ApiTags('Botanical Species')
@Controller('v1/botanical-species')
export class BotanicalSpeciesController {
  public constructor(private readonly botanicalSpeciesFacadeService: BotanicalSpeciesFacadeService) {}

  @Get()
  public findAll(): Promise<BotanicalSpeciesDto[]> {
    return this.botanicalSpeciesFacadeService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<BotanicalSpeciesDto> {
    return this.botanicalSpeciesFacadeService.findOne(id);
  }
}
