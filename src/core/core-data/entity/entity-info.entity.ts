import {
  Column,

  CreateDateColumn,

  DeleteDateColumn, PrimaryGeneratedColumn,

  UpdateDateColumn,

  VersionColumn
} from 'typeorm';

/**
 * Base class for the database entities with common properties.
 */
export abstract class EntityInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChanged: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @VersionColumn()
  version: number;
}
