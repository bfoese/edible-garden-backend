import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';

/**
 * This resolver will extract the preferred locale of the user when the request
 * is made with a user context.
 *
 * It is possible to provide options from outside by using
 * \@I18nResolverOptions() in the constructor. See docs of nestjs-i18n lib for
 * more info if needed.
 */
@Injectable()
export class EgI18nUserLocaleResolver implements I18nResolver {
  private logger = new Logger(EgI18nUserLocaleResolver.name);

  public async resolve(context: ExecutionContext): Promise<string | undefined> {
    let req: any;

    // see docs for how to adapt this for GraphQL
    switch (context.getType() as string) {
      case 'http':
        req = context.switchToHttp().getRequest();
        break;
      case 'graphql':
        [, , { req }] = context.getArgs();
        break;
    }

    if (req) {
      try {
        const user = await req.user;
        return user?.preferredLocale;
      } catch (error) {
        this.logger.debug('Failed to extract user from request');
      }
    }
    return undefined;
  }
}
