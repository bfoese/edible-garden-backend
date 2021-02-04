/**
 * FindOptions with common values for all repositiories
 */
export interface CommonFindOptions {
  /**
   * Whether or not to include soft-deleted rows. By default, soft-deleted rows are not included in the result set.
   */
  withDeleted?: boolean;
}
