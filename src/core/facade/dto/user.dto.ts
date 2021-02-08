import { EntityInfoDto } from '@eg-core/facade/dto/entity-info.dto';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    type: EntityInfoDto,
  })
  public entityInfo: EntityInfoDto;

  @ApiProperty(<ApiPropertyOptions>{
    type: 'string',
  })
  public username: string;

  @ApiProperty(<ApiPropertyOptions>{
    type: 'string',
  })
  public email: string;
}
