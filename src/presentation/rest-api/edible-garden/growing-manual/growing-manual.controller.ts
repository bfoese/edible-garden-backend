import { GrowingManualDto } from '@eg-presentation-facade/growing-manual/dto/growing-manual.dto';
import { GrowingManualFacadeService } from '@eg-presentation-facade/growing-manual/growing-manual-facade.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Growing Manual')
@Controller('v1/growing-manual')
export class GrowingManualController {
  public constructor(private readonly growingManualFacadeService: GrowingManualFacadeService) {}

  @Get()
  public findAll(): Promise<GrowingManualDto[]> {
    return this.growingManualFacadeService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<GrowingManualDto> {
    return this.growingManualFacadeService.findOne(id);
  }
}
