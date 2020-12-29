import { EntitySchemaRelationOptions } from 'typeorm';

/**
 * Type definition for having TypeORM embedded relations strictly typed in external schema definitions.
 */
export type EntitySchemaRelation<T> = { [P in keyof T]?: EntitySchemaRelationOptions };
