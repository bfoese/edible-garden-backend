export interface UserFindOptions {

  withHiddenFields?: {
    password?: boolean;
    accountActionToken?: boolean;
    address?: boolean;
    phoneNumber?: boolean;
  };
}
