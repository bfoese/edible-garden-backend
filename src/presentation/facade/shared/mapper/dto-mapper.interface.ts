export interface DtoMapper<TDto, TEntity> {
  toDto(entity: TEntity): Partial<TDto>;
}
