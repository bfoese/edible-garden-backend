import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BotanicalFamilyFacadeService } from 'src/presentation/facade/botanical-family/botanical-family-facade.service';
import { BotanicalFamilyDto } from 'src/presentation/facade/botanical-family/dto/botanical-family.dto';

@Controller('v1/botanical-family')
export class BotanicalFamilyController {
  public constructor(private readonly botanicalFamilyFacadeService: BotanicalFamilyFacadeService) {}

  @Get()
  public findAll(): Observable<Partial<BotanicalFamilyDto>[]> {
    return this.botanicalFamilyFacadeService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Observable<Partial<BotanicalFamilyDto>> {
    return this.botanicalFamilyFacadeService.findOne(id);
  }
}
