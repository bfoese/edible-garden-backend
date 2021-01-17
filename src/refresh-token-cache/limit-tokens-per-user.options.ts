export interface LimitTokensPerUserOptions {
  /**
   * @param maxNoOfTokens - Number defining the maximum number of tokens to
   * store for a user. If a token above that limit is about to be stored, the
   * reducer function will be applied to determine which of the previously
   * stored tokens can be dropped from the cache.
   */
  maxNoOfTokens: number;
  /**
   * Reducer function to provide the logic which of the tokens of the user
   * should be removed when exceeding the defined limit of maximum number of
   * tokens for this user
   *
   * @param prev - previous token
   * @param curr - current token
   * @returns The returned token will be removed for the user if we ran into the
   * defined limit of maximum number of tokens for this user
   */
  maxNoOfTokensReducer: (prev: string, curr: string) => string;
}
