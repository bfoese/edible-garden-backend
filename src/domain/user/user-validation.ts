
export class UserValidation {

  public static readonly constraints = {
    username: {
      minLength: 2,
      maxLength: 20,
    },
    password: {
      pattern: /^(?=.*[\S])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zßA-Z\d"'|~+-@$!%*?&\\/§\[\]\{\}\(\)]{8,}$/ as RegExp,
    },
  };

  public static readonly groups = {
    userRegistration: 'user-registration',
  };
}
