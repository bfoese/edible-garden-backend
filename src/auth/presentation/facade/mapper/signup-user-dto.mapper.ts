import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { OntoEntityMapper } from '@eg-core/facade/mapper/contract/onto-entity-mapper.interface';
import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';

import { SignupUserDto } from '../dto/signup-user.dto';

@Injectable()
export class SignupUserDtoMapper implements DtoMapper<SignupUserDto, User>, OntoEntityMapper<SignupUserDto, User> {
  public toDto(entity: User): SignupUserDto {
    if (entity) {
      const dto = {
        ...entity,
        // DTO should never receive hashed password. Actually the password
        // should already been stripped out from the user object on another
        // layer, but better safe than sorry :)
        password: undefined,
      } as SignupUserDto;
      return dto;
    }
    return undefined;
  }

  public ontoEntity(dto: SignupUserDto, entity: User): User {
    if (entity) {
      entity.email = dto.email;
      entity.username = dto.username;
      entity.password = dto.password;
      entity.preferredLocale = dto.preferredLocale;
    }
    return entity;
  }
}
