export enum NamedErrorCode {
  UniqueKeyConstraintViolation = 1000,

  // 2xxx - business rule errors
  UserSoftDeleted = 2000,
  ActionDeniedConsultEmailAccount = 2001,
  InvalidUsernameOrPassword = 2002,
  AccountNotActivated = 2003,
}
