import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { Injectable } from '@nestjs/common';

import { JwtTokenDto } from '../dto/jwt-token.dto';

@Injectable()
export class JwtTokenDtoMapper implements DtoMapper<JwtTokenDto, string> {
  public toDto(entity: string): JwtTokenDto {
    if (entity) {
      const dto = new JwtTokenDto();
      dto.token = entity;
      return dto;
    }
    return undefined;
  }
}
