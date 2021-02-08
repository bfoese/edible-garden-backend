/**
 * Classifies the material that can be used to propagate a plant. Some types are grouped, as we don't need so much detail
 */
export enum SeedReproductionQuality {
  /**
   * Samenfest
   */
  trueToSeed = 'truetoSeed',
  /**
   * Knollen, Zwiebeln, Rhizom
   */
  hybrid = 'hybrid',
  /**
   * aus Saat gezogene Jungpflanzen
   */
  seedling = 'seedling',
  /**
   * Stecklinge, Ableger
   */
  cuttingOffshoot = 'cuttingOffshoot',
}
