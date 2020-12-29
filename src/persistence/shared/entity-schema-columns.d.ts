import { EntitySchemaColumnOptions } from 'typeorm';

/**
 * Type definition for having TypeORM embedded classes strictly typed in external schema definitions.
 */
export type EntitySchemaColumns<T> = { [P in keyof T]?: EntitySchemaColumnOptions };
