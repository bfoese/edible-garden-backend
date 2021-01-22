import { ErrorCodeWithName } from './error-code-with-name.enum';
import { NamedErrorBuilder } from './named-error.builder';

export class ApplicationErrorRegistry {
  /**
   * Message args: unique field name(s)
   */
  public static UniqueKeyConstraintViolation = new NamedErrorBuilder()
    .errorCodeWithName(ErrorCodeWithName.err1000)
    .errorMsg(
      (...msgArgs: string[]) =>
        'Save failed due to unique key constraint violation' +
        ApplicationErrorRegistry.ifArgs(` - one or all of these fields must be unique: ${msgArgs}`, ...msgArgs)
    )
    .build();

  // Codes with 2xxx - Business rule errors

  /**
   * Error to be thrown when an action is denied because the user ist marked
   * for deletion (= soft deleted). Message args: username
   */
  public static ActionDeniedUserSoftDeleted = new NamedErrorBuilder()
    .errorCodeWithName(ErrorCodeWithName.err2000)
    .errorMsg(
      (...msgArgs: string[]) =>
        'Action denied as the specified user is marked for deletion' +
        ApplicationErrorRegistry.ifArgs(` - username=${msgArgs}`, ...msgArgs)
    )
    .build();

  /**
   * Error to be thrown when an action is denied because of some business rule
   * and indicating that further information concerning the error was sent the
   * the users registered email address.
   *
   * Message args: username
   *
   * Sending an email with error information instead of returning the error
   * information via the API can be used to prevent sensitive data being
   * exposed to the public. For example: A user tries to register a new
   * account and the system detects, that there already is an account for the
   * given email address. The system could return a unique key error with the
   * information that the email field must be unique, but then the API could
   * be used to sniff out which email addresses are registered in the system.
   * A better way to handle this is to throw this generic
   * ActionDeniedConsultEmailAccount error instead along with sending an email
   * to the email adress of the already registered account with an account
   * reminder (in case the user itself forgot that he already created an
   * account). This way a potential attacker won't know that the email address
   * exists within the system.
   */
  public static ActionDeniedConsultEmailAccount = new NamedErrorBuilder()
    .errorCodeWithName(ErrorCodeWithName.err2001)
    .errorMsg(
      (...msgArgs: string[]) =>
        'Action denied. The user received an email with further information concerning the error' +
        ApplicationErrorRegistry.ifArgs(` - username=${msgArgs}`, ...msgArgs)
    )
    .build();

  /**
   * Returns a given string only if there are arguments provided. Otherwise an empty string will be returned.
   * @param result - Returns the result string if msgArgs exist and aren't empty
   * @param msgArgs -
   */
  private static ifArgs(result: string, ...msgArgs: string[]): string {
    return msgArgs && msgArgs.length > 0 ? result : '';
  }
}
