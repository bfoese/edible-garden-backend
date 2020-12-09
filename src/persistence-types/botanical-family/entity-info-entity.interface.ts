export interface EntityInfoEntity {
  id: string;
  isActive: boolean;
  created: Date;
  lastChanged: Date;
  deletedAt?: Date;
  version: number;
}
