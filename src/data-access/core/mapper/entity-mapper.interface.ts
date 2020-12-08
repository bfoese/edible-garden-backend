export interface EntityMapper<TDto, TEntity> {
  toEntity(dto: TDto): Partial<TEntity>;
}
