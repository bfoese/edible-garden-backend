import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class JwtTokenDto {
  @ApiProperty(<ApiPropertyOptions>{
    type: 'string',
  })
  public access_token: string;
}
