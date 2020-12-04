export interface EntityMapper<TDto, TEntity> {
  toDto(entity: TEntity): TDto;
  // toEntity(dto: TDto): TEntity;
  // ontoEntity(dto: TDto, entity: TEntity): TEntity;
}
