import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../core/core-facade/dto/base.dto';

export class BotanicalFamilyDto extends BaseDto {
  @ApiProperty()
  readonly botanicalName: string;
}
