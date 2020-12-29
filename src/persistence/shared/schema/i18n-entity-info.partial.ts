import { I18nEntity } from '@eg-domain/shared/i18n-entity';
import { EntitySchemaColumnOptions, EntitySchemaRelationOptions, JoinColumnOptions } from 'typeorm';
import { EntitySchemaUniqueOptions } from 'typeorm/entity-schema/EntitySchemaUniqueOptions';
import { EntitySchemaColumns } from '../entity-schema-columns';
import { EntitySchemaRelation } from '../entity-schema-relation';

export const I18nEntitySchemaColumns = <T>(): EntitySchemaColumns<I18nEntity<T>> =>
  <EntitySchemaColumns<I18nEntity<T>>>{
    languageCode: {
      type: 'varchar',
      length: 5,
      nullable: false,
    } as EntitySchemaColumnOptions,
  };

export const I18nEntitySchemaRelation = <T>(
  parentTargetName: string,
  joinColumnName: string
): EntitySchemaRelation<I18nEntity<T>> =>
  <EntitySchemaRelation<I18nEntity<T>>>{
    parent: {
      type: 'many-to-one',
      target: parentTargetName,
      onDelete: 'CASCADE',
      joinColumn: <JoinColumnOptions>{ name: joinColumnName },
    } as EntitySchemaRelationOptions,
  };

export const I18nEntitySchemaUnique = (parentTargetName: string): EntitySchemaUniqueOptions =>
  (<EntitySchemaUniqueOptions>{
    name: `uq_${parentTargetName}_languageCode`,
    columns: ['languageCode', 'parent'],
  }) as EntitySchemaUniqueOptions;
