import { EntitySchemaColumnOptions } from 'typeorm';

export const EntityInfoSchema = {
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

  deletedAt: {
    type: 'timestamptz',
    deleteDate: true,
    nullable: true,
  } as EntitySchemaColumnOptions,

  version: {
    version: true,
  } as EntitySchemaColumnOptions,
};
