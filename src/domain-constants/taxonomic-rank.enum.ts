export enum TaxonomicRank {
  /**
   * Variety - Varietät
   *
   * Different varieties of the same species/subspecies do not produce fertile
   * bastards.
   */
  variety = 'variety',

  /**
   * Subspecies - Unterart
   *
   * Subspecies are either living in a different geographic region or in a
   * differnt habitat while sharing the same phenotype. Different subspecies of
   * the the same species are able to have fertile bastards.
   */
  subspecies = 'subspecies',

  /**
   * Species - Art
   */
  species = 'species',

  /**
   * Genus - Gattung
   */
  genus = 'genus',

  /**
   * Family - Familie
   */
  family = 'family',
}
