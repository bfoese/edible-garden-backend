export interface OntoEntityMapper<TDto, TEntity> {
  ontoEntity(dto: TDto, entity: TEntity): TEntity;
}
