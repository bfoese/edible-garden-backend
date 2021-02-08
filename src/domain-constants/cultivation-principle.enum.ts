/**
 * Classifies the ethics applied during cultivation when deciding for fertilizers, herbicides and pesticides.
 * It does not require to have an official certificate but rather reflects the in practice
 */
export enum CultivationPrinciple {
  /**
   * Organic does not necessarily requires to be a certified organic farmer, but to forego synthetic substances.
   */
  organic = 'organic',
  /**
   * Synthetic substances are used as fertilizer, herbicide or pesticide.
   */
  synthetic = 'synthetic',
}
