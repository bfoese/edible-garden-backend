export class UserValidation {
  public static readonly constraints = {
    username: {
      minLength: 2,
      maxLength: 20,
    },
    password: {
      minLength: 8,
      pattern: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/ as RegExp,
    },
  };

  public static readonly groups = {
    userRegistration: 'user-registration',
  };
}
