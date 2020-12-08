export interface SoftDeleteActionRepository {
  softDelete(id: string): Promise<boolean>;
  recover(id: string): Promise<boolean>;
}
