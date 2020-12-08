export interface DeleteActionRepository {
  delete(id: string): Promise<boolean>;
}
