
/**
 * Used to transfer a new passwort from the client to the server. The user
 * resource is encoded within the token. The client will be provided with the
 * token when the server initates the process of resetting the password.
 *
 * Do NOT include address of sender.
 */
export class E2EEmailDto {
  public date?: Date;
  public subject?: string;
  public to?: string;
  public body?: string;
}
