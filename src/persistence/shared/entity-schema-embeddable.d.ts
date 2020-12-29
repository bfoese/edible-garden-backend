import { EntitySchemaEmbeddedOptions } from 'typeorm/entity-schema/EntitySchemaEmbeddedOptions';

/**
 * Type definition for having TypeORM embedded columns strictly typed in external schema definitions.
 */
export type EntitySchemaEmbeddable<T> = { [P in keyof T]?: EntitySchemaEmbeddedOptions };
