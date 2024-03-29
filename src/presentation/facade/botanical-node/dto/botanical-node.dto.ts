import { ApiProperty } from '@nestjs/swagger';
import { BotanicalNodeBaseDto } from './botanical-node-base.dto';

export class BotanicalNodeDto extends BotanicalNodeBaseDto {
  @ApiProperty({
    type: BotanicalNodeDto,
  })
  public parent?: BotanicalNodeDto;
}
