import { ApiProperty } from '@nestjs/swagger';
import { BotanicalNodeBaseDto } from './botanical-node-base.dto';

export class BotanicalTreeNodeDto extends BotanicalNodeBaseDto {
  @ApiProperty({
    type: 'array',
  })
  public children: BotanicalTreeNodeDto[];
}
