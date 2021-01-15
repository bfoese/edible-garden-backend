import { EntitySchemaUniqueOptions } from '@bfoese/typeorm/entity-schema/EntitySchemaUniqueOptions';
import { User } from '@eg-domain/user/user';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.embed';
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { EntitySchemaEmbeddedOptions } from 'typeorm/entity-schema/EntitySchemaEmbeddedOptions';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const UserSchema = new EntitySchema<User>(<EntitySchemaOptions<User>>{
  name: 'user',

  uniques: [
    <EntitySchemaUniqueOptions>{ name: 'UQ_username', columns: ['username'] },
    <EntitySchemaUniqueOptions>{ name: 'UQ_email', columns: ['email'] },
  ],

  embeddeds: {
    entityInfo: {
      isArray: false,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      type: () => EntityInfoSchema(),
      prefix: '',
    } as EntitySchemaEmbeddedOptions,
  },
  columns: {
    email: {
      type: 'varchar',
      length: 320,
      nullable: false,
    } as EntitySchemaColumnOptions,

    username: {
      type: 'varchar',
      length: 20,
      nullable: false,
    } as EntitySchemaColumnOptions,

    password: {
      type: 'varchar',
      length: 200,
      nullable: false,
    } as EntitySchemaColumnOptions,
  },
});
