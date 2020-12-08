import { EntityInfoDto } from '@eg-core/dto/entity-info.dto';
import { EntityInfo } from '@eg-core/entity/entity-info.entity';
import { Injectable } from '@nestjs/common';
import { DtoMapper } from './dto-mapper.interface';

@Injectable()
export class EntityInfoMapper implements DtoMapper<EntityInfoDto, EntityInfo> {
  public toDto(entity: EntityInfo): Partial<EntityInfoDto> {
    const dto: Partial<EntityInfoDto> = {
      id: entity.id ?? undefined,
      created: entity.created ?? undefined,
      lastChanged: entity.lastChanged ?? undefined,
      version: entity.version ?? undefined,
      deletedAt: entity.deletedAt ?? undefined,
    };
    Object.keys(dto).forEach((key) => dto[key] === undefined && delete dto[key]);
    return dto;
  }
}
