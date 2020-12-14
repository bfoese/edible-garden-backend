import { EntityInfo } from '@eg-domain/shared/entity-info.entity';
import { EntitySchemaColumnOptions } from 'typeorm';
import { EmbeddedSchema } from '../embedded-schema';

export const EntityInfoSchema = <EmbeddedSchema<EntityInfo>>{
  id: {
    type: 'uuid',
    primary: true,
    generated: 'uuid',
  } as EntitySchemaColumnOptions,

  isActive: {
    type: 'boolean',
    default: true,
  } as EntitySchemaColumnOptions,

  created: {
    type: 'timestamptz',
    createDate: true,
  } as EntitySchemaColumnOptions,

  lastChanged: {
    type: 'timestamptz',
    updateDate: true,
  } as EntitySchemaColumnOptions,

  deleted: {
    type: 'timestamptz',
    deleteDate: true,
    nullable: true,
  } as EntitySchemaColumnOptions,

  version: {
    version: true,
  } as EntitySchemaColumnOptions,
};
