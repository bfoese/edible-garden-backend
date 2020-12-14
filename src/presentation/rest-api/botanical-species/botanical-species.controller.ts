import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BotanicalSpeciesFacadeService } from 'src/presentation/facade/botanical-species/botanical-species-facade.service';
import { BotanicalSpeciesDto } from 'src/presentation/facade/botanical-species/dto/botanical-species.dto';

@Controller('v1/botanical-species')
export class BotanicalSpeciesController {
  public constructor(private readonly botanicalSpeciesFacadeService: BotanicalSpeciesFacadeService) {}

  @Get()
  public findAll(): Observable<Partial<BotanicalSpeciesDto>[]> {
    return this.botanicalSpeciesFacadeService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Observable<Partial<BotanicalSpeciesDto>> {
    return this.botanicalSpeciesFacadeService.findOne(id);
  }
}
