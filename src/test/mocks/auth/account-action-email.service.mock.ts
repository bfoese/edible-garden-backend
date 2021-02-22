/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccountActionPurpose } from '@eg-auth/constants/account-action-purpose';

const mockedAccountActionEmailService = {
  sendAccountActionEmail: (_purpose: AccountActionPurpose, _email: string): Promise<void> => Promise.resolve(),
};

export default mockedAccountActionEmailService;
