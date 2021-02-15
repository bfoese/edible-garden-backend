import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';

import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserMapper implements DtoMapper<UserDto, User> {
  public constructor() {}

  public toDto(entity: User): UserDto {
    if (!entity) {
      return undefined;
    }
    const dto = new UserDto();
    dto.id = entity.entityInfo?.id;
    dto.email = entity.email;
    dto.username = entity.username;
    dto.preferredLocale = entity.preferredLocale;
    return dto;
  }
}
