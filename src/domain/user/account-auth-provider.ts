import { IsEnum, IsNotEmpty } from 'class-validator';

import { ExternalAuthProvider } from './external-auth-provider.enum';
import { UserValidation } from './user-validation';

export class AccountAuthProvider {
  public constructor() {
  }

  @IsEnum(ExternalAuthProvider, {
    groups: [UserValidation.groups.userExtAuthProviderRegistration]
  })
  public extAuthProvider: ExternalAuthProvider;

  /**
   * The userId from the external auth provier. Is only required when the user registered with an external auth provider.
   */
  @IsNotEmpty()
  public extUserId: string;
}
