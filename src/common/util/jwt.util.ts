export class JwtUtil {
  /**
   * RFC 7519 states that the 'exp' and 'iat' claim values are JSON numeric
   * values representing the number of seconds (not milliseconds) from
   * 1970-01-01T00:00:00Z UTC until the specified UTC date/time, ignoring leap
   * seconds.
   * @param jwtNumericTimestamp - e.g. the claims 'exp' or 'iat' from the JWT payload
   */
  public static jwtTimestampToDate(jwtNumericTimestamp: number): Date | undefined {
    return jwtNumericTimestamp ? new Date(jwtNumericTimestamp * 1000) : undefined;
  }

  public static registeredClaims = {
    /** Issued At */
    iat: 'iat',
    /** Issuer */
    iss: 'iss',
    /** Subject */
    sub: 'sub',
    /** Expiration Time */
    exp: 'exp',
    /** Audience */
    aud: 'aud',
    /** JWT ID */
    jti: 'jti',
    /** Not Before */
    nbf: 'nbf',
  };
}
