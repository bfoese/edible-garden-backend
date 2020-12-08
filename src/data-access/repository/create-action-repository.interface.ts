export interface CreateActionRepository<TDto, TEntity> {
  create(dto: TDto): Promise<TEntity>;
}
