export interface UserFindOptions {

  withHiddenFields?: {
    email?: boolean;
    password?: boolean;
    accountActionToken?: boolean;
  };
}
