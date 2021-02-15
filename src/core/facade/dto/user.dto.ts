import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty(<ApiPropertyOptions>{
    type: 'string',
  })
  public id: string;

  @ApiProperty(<ApiPropertyOptions>{
    type: 'string',
  })
  public username: string;

  @ApiProperty(<ApiPropertyOptions>{
    type: 'string',
  })
  public email: string;

  @ApiProperty(<ApiPropertyOptions>{
    type: 'string',
    examples: ['de', 'de-AT'],
  })
  public preferredLocale: string;
}
