import { EntityInfo } from '@eg-domain/shared/entity-info';
import { Injectable } from '@nestjs/common';

import { EntityInfoDto } from '../dto/entity-info.dto';
import { DtoMapper } from './contract/dto-mapper.interface';
import { OntoEntityMapper } from './contract/onto-entity-mapper.interface';

@Injectable()
export class EntityInfoMapper
  implements DtoMapper<EntityInfoDto, EntityInfo>, OntoEntityMapper<EntityInfoDto, EntityInfo> {
  public toDto(entity: EntityInfo): EntityInfoDto {
    const dto = new EntityInfoDto();
    dto.id = entity.id ?? undefined;
    dto.version = entity.version ?? undefined;
    dto.deleted = entity.deleted ?? undefined;
    return dto;
  }

  public ontoEntity(dto: EntityInfoDto, entity: EntityInfo): EntityInfo {
    if (!dto) {
      return entity;
    }
    if (!entity) {
      entity = new EntityInfo();
    }
    entity.id = dto.id;

    return entity;
  }
}
