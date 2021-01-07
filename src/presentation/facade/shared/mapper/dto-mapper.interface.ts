export interface DtoMapper<TDto, TEntity> {
  toDto(entity: TEntity): Partial<TDto>;
}

export interface DtoEnumMapper<TDto extends string | number, TEntity> extends DtoMapper<TDto, TEntity> {
  toDtoString(entity: TEntity): string;
}
