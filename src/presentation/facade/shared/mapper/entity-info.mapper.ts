import { EntityInfo } from '@eg-domain/shared/entity-info.entity';
import { Injectable } from '@nestjs/common';
import { EntityInfoDto } from '../dto/entity-info.dto';
import { DtoMapper } from './dto-mapper.interface';

@Injectable()
export class EntityInfoMapper implements DtoMapper<EntityInfoDto, EntityInfo> {
  public toDto(entity: EntityInfo): Partial<EntityInfoDto> {
    const dto: Partial<EntityInfoDto> = {
      id: entity.id ?? undefined,
      created: entity.created ?? undefined,
      lastChanged: entity.lastChanged ?? undefined,
      version: entity.version ?? undefined,
      deleted: entity.deleted ?? undefined,
    };
    Object.keys(dto).forEach((key) => dto[key] === undefined && delete dto[key]);
    return dto;
  }
}
