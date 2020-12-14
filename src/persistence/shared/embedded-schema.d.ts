import { EntitySchemaColumnOptions } from 'typeorm';

/**
 * Type definition for having TypeORM embedded columns strictly typed in external schema definitions.
 */
export type EmbeddedSchema<T> = { [P in keyof T]?: EntitySchemaColumnOptions };
