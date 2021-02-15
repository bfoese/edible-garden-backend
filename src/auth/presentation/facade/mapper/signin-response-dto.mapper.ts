import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { UserMapper } from '@eg-core/facade/mapper/user.mapper';
import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';

import { SigninResponseDto } from '../dto/signin-response.dto';
import { JwtTokenDtoMapper } from './jwt-token-dto.mapper';

@Injectable()
export class SigninResonseDtoMapper implements DtoMapper<SigninResponseDto, { user: User; jsonWebToken: string; }> {
  public constructor(private jwtTokenDtoMapper: JwtTokenDtoMapper, private userMapper: UserMapper) {}

  public toDto(entity: { user: User; jsonWebToken: string; }): SigninResponseDto {
    const dto = new SigninResponseDto();
    dto.accessToken = this.jwtTokenDtoMapper.toDto(entity.jsonWebToken);
    dto.user = this.userMapper.toDto(entity.user);
    return dto;
  }
}
