import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

/**
 * Base class for the database entities with common properties.
 */
export abstract class EntityInfo {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'active', type: 'boolean', default: true })
  public isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public created: Date;

  @UpdateDateColumn({ name: 'last_changed', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public lastChanged: Date;

  @DeleteDateColumn({ name: 'deleted', nullable: true })
  public deletedAt?: Date;

  @VersionColumn()
  public version: number;
}
