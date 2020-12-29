import { BotanicalNodeFacadeService } from '@eg-presentation-facade/botanical-node/botanical-node-facade.service';
import { BotanicalNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-node.dto';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Botanical Node')
@Controller('v1/botanical-node')
export class BotanicalNodeController {
  public constructor(private readonly botanicalNodeFacadeService: BotanicalNodeFacadeService) {}

  @Get()
  public findAll(): Promise<BotanicalNodeDto[]> {
    return this.botanicalNodeFacadeService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<BotanicalNodeDto> {
    return this.botanicalNodeFacadeService.findOne(id);
  }
}
