import { UserDto } from '@eg-core/facade/dto/user.dto';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { JwtTokenDto } from './jwt-token.dto';

export class SigninResponseDto {
  @ApiProperty(<ApiPropertyOptions>{
    type: JwtTokenDto,
  })
  public accessToken: JwtTokenDto;

  @ApiProperty(<ApiPropertyOptions>{
    type: UserDto,
  })
  public user: UserDto;
}
