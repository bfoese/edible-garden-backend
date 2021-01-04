import { MixedCultureDto } from '@eg-presentation-facade/mixed-culture/dto/mixed-culture.dto';
import { MixedCultureFacadeService } from '@eg-presentation-facade/mixed-culture/mixed-culture-facade.service';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mixed Culture')
@Controller('v1/mixed-culture')
export class MixedCultureController {
  public constructor(private readonly mixedCultureFacadeService: MixedCultureFacadeService) {}

  @Get()
  public findAll(): Promise<MixedCultureDto[]> {
    return this.mixedCultureFacadeService.findAll();
  }
}
