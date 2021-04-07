import { I18nLangCacheInterceptor } from '@eg-app/cache/eg-i18n-lang-cache.interceptor';
import { BotanicalNodeFacadeService } from '@eg-presentation-facade/botanical-node/botanical-node-facade.service';
import { BotanicalNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-node.dto';
import { BotanicalTreeNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-tree-node.dto';
import {
  CacheTTL,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';

@ApiTags('Botanical Node')
@Controller('v1/botanical-node')
export class BotanicalNodeController {
  public constructor(private readonly botanicalNodeFacadeService: BotanicalNodeFacadeService) {}

  @CacheTTL(60 * 60 * 24) // 24hrs
  @UseInterceptors(I18nLangCacheInterceptor)
  @Get('tree')
  public getTree(@I18nLang() i18nLang: string): Promise<BotanicalTreeNodeDto[]> {
    return this.botanicalNodeFacadeService.getTree(i18nLang);
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<BotanicalNodeDto> {
    return this.botanicalNodeFacadeService.findOne(id);
  }
}
