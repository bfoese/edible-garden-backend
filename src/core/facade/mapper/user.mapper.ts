import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { EntityInfoMapper } from '@eg-core/facade/mapper/entity-info.mapper';
import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';

import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserMapper implements DtoMapper<UserDto, User> {
  public constructor(private entityInfoMapper: EntityInfoMapper) {}

  public toDto(entity: User): UserDto {
    if (!entity) {
      return undefined;
    }
    const dto = new UserDto();
    dto.email = entity.email;
    dto.username = entity.username;

    if (entity.entityInfo) {
      dto.entityInfo = this.entityInfoMapper.toDto(entity.entityInfo);
    }
    return dto;
  }
}
