import { EntityInfo } from '@eg-domain/shared/entity-info';
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const EntityInfoSchema = (): EntitySchema<EntityInfo> =>
  new EntitySchema<EntityInfo>(<EntitySchemaOptions<EntityInfo>>{
    name: 'entityInfo',
    columns: {
      id: {
        type: 'uuid',
        primary: true,
        generated: 'uuid',
        default: 'uuid_generate_v4()',
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
        default: 1,
      } as EntitySchemaColumnOptions,
    },
  });
