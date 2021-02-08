export enum TaxonomicRank {
  /**
   * Sorte
   *
   * A cultivar (cultivated variety) is an assemblage of plants
   * selected for desirable characteristics that are maintained during
   * propagation. More generally, a cultivar is the most basic classification
   * category of cultivated plants in the International Code of Nomenclature for
   * Cultivated Plants (ICNCP). Most cultivars arise in cultivation, but some
   * are from wild plants that have distinctive characteristics. The naming of
   * cultivars is an important aspect of cultivated plant taxonomy, and the
   * correct naming of a cultivar is prescribed by the Rules and Recommendations
   * of the International Code of Nomenclature for Cultivated Plants (ICNCP,
   * commonly denominated the Cultivated Plant Code). A cultivar is given a
   * cultivar name, which consists of the scientific Latin botanical name
   * followed by a cultivar epithet. The cultivar epithet is usually in a
   * vernacular language. For example, the full cultivar name of the King Edward
   * potato is Solanum tuberosum 'King Edward'. 'King Edward' is the cultivar
   * epithet, which, according to the Rules of the Cultivated Plant Code, is
   * bounded by single quotation marks.[
   */
  cultivar = 'cultivar',
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
