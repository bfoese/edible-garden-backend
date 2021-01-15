import { EntitySchema, QueryFailedError } from '@bfoese/typeorm';
import { EntitySchemaUniqueOptions } from '@bfoese/typeorm/entity-schema/EntitySchemaUniqueOptions';
import { StringUtil } from '@eg-common/util/string.util';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

import { UniqueConstraintViolation } from './unique-constraint-violation';

export class UniqueConstraintViolationFactory {
  public static async getUniqueConstraintViolationOrNull<T>(
    queryFailedError: QueryFailedError,
    schema: EntitySchema<T>,
    entity: T
  ): Promise<UniqueConstraintViolation | undefined> {
    const errorMsg = queryFailedError?.message;
    if (errorMsg && schema) {
      const uniqueConstraints: EntitySchemaUniqueOptions[] = schema.options.uniques;

      if (uniqueConstraints) {
        const violatedUniqueConstraint = await from(uniqueConstraints)
          .pipe(
            first((uniqueConstraint: EntitySchemaUniqueOptions) =>
              StringUtil.contains(errorMsg, uniqueConstraint.name, true)
            )
          )
          .toPromise()
          .then((match: EntitySchemaUniqueOptions) => {
            return !match ? undefined : new UniqueConstraintViolation(match.name, match.columns, entity);
          });
        return violatedUniqueConstraint;
      }
    }
    return undefined;
  }
}
