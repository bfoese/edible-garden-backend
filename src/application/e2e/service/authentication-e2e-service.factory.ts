import appConfig from '@eg-app/config/app.config';
import emailConfig from '@eg-app/config/email.config';
import { ImapService } from '@eg-app/imap/imap.service';
import { UserService } from '@eg-data-access/user/user.service';
import { ConfigType } from '@nestjs/config';

import { AuthenticationE2EServiceImpl } from './authentication-e2e-impl.service';
import { AuthenticationE2EServiceStub } from './authentication-e2e-stub.service';
import { AuthenticationE2EService } from './authentication-e2e.service';

/**
 * The E2E Api will be used in development/qa as a quick and dirty toolbox. In
 * case the API is exposed in production environment we want to have a stub
 * service injected instead of a real implementation to ensure, that sensitive
 * data is not changed nor exposed. Therefore we use this factory to decide if
 * the real service implementation or an emty stub should be provided depending
 * on the runtime environment.
 *
 * Other possibilities to solve this use case:
 * <ul>
 *   <li>Async Module creation: https://github.com/nestjs/nest/issues/601#issuecomment-486538316
 *     in combination with token provider. The module creation function would check
 *     the environment and based on that one or another provider token (see
 *     UserRepositoryProvider as an example for such a token) would be used. This
 *     might be even better compared to the current solution, because now all
 *     dependencies of the dev/qa service must be injected into the service factory,
 *     but for the production stub non of these dependencies are needed. Using
 *     the provider token, my assumption would be, that when in production the dev/qa
 *     instance of the service is not being instantiated at all, therefore non of its
 *     dependencies are being loaded (TODO verification needed).
 *   </li>
 *   <li>Proxy Pattern: No service factory in the module, instead the responsibility
 *     to check the current environment is delegated to a proxy service instance. The
 *     proxy service injects the stub and the real implementation and decides based
 *     on environment which one to call. The drawback: Other internal services of the
 *     module might forget to use the proxy and instead use the implementation directly.
 *     The current solution is safer because the dev/qa service implementation is not
 *     provided in the module at all when being in production. Even if you accidently
 *     inject the dev/qa service implementation directly into other services, it
 *     would lead to a runtime exception that the service was not found in production.
 *   </li>
 * </ul>
 */
export const AuthenticationE2EServiceFactory = {
  provide: AuthenticationE2EService.INJECT_TOKEN,
  useFactory: (
    _appConfig: ConfigType<typeof appConfig>,
    _emailConfig: ConfigType<typeof emailConfig>,
    imapService: ImapService,
    userService: UserService
  ): AuthenticationE2EService => {
    if (_appConfig.isProduction()) {
      return new AuthenticationE2EServiceStub();
    } else {
      return new AuthenticationE2EServiceImpl(_emailConfig, imapService, userService);
    }
  },
  inject: [appConfig.KEY, emailConfig.KEY, ImapService, UserService],
};
