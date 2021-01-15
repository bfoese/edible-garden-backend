import { OntoEntityMapper } from '@eg-core/facade/mapper/contract/onto-entity-mapper.interface';
import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';

import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class RegisterUserMapper implements OntoEntityMapper<RegisterUserDto, User> {
  public toDto(entity: User): RegisterUserDto {
    if (entity) {
      const dto = <RegisterUserDto>{
        ...entity,
        password: undefined, // DTO should never receive hashed password
      };
      return dto;
    }
    return undefined;
  }

  public ontoEntity(dto: RegisterUserDto, entity: User): User {
    if (entity) {
      entity.email = dto.email;
      entity.username = dto.username;
      entity.password = dto.password;
    }
    return entity;
  }
}
