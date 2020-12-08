export interface UpdateActionRepository<TDto, TEntity> {
  update(id: string, dto: TDto): Promise<TEntity>;
}
