/**
 * Classifies the material that can be used to propagate a plant. Some types are grouped, as we don't need so much detail
 */
export enum ShareableReproductiveMaterial {
  /**
   * Samen
   */
  seed = 'seed',
  /**
   * Knollen, Zwiebeln, Rhizom
   */
  tuberBulbRhizome = 'tuberBulbRhizome',
  /**
   * aus Saat gezogene Jungpflanzen
   */
  seedling = 'seedling',
  /**
   * Stecklinge, Ableger
   */
  cuttingOffshoot = 'cuttingOffshoot',
}
