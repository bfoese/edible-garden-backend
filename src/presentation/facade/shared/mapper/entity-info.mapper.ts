import { EntityInfo } from '@eg-domain/shared/entity-info';
import { Injectable } from '@nestjs/common';
import { EntityInfoDto } from '../dto/entity-info.dto';
import { DtoMapper } from './dto-mapper.interface';

@Injectable()
export class EntityInfoMapper implements DtoMapper<EntityInfoDto, EntityInfo> {
  public toDto(entity: EntityInfo): EntityInfoDto {
    const dto = new EntityInfoDto();
    dto.id = entity.id ?? undefined;
    dto.version = entity.version ?? undefined;
    dto.deleted = entity.deleted ?? undefined;
    return dto;
  }
}
