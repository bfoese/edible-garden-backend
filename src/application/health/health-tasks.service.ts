import healthConfig from '@eg-app/config/health.config';
import { ArrayUtils } from '@eg-common/util/array.utils';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import {
  DNSHealthIndicator,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@Injectable()
export class HealthTasksService {

  private readonly logger = new Logger(HealthTasksService.name);

  public constructor(
    private readonly healthCheckService: HealthCheckService,
    private dns: DNSHealthIndicator,
    @Inject(healthConfig.KEY)
    private readonly _healthConfig: ConfigType<typeof healthConfig>
  ) {}

  /**
   * Heroku dynos go to idle state without traffic after 30 minutes. Currently
   * there is a limit of 1000 free hours per month for all apps. If that limit
   * is reached, all apps are forced to sleep until the end of the month.
   * Keeping the production dynos up for 24h will stress this limit. A
   * compromise is to be up within a certain period of time. This keeps the
   * configured dynos up between 7am and 11pm by pinging them every 20 minutes.
   * I choose 20 minutes instead of 30, for the edge case where the pinging
   * application is being deployed shortly before the next ping iteration. In
   * this case there would be a gap of nearly one hour between the next ping.
   */
  @Cron('0 */20 7-23 * * *')
  public async cardiacMassageDyno(): Promise<void> {
    if (!this._healthConfig.cardiacMassageDynoEnabled) {
      return;
    }

    const pingDestinations: string[] = this._healthConfig.cardiacMassageDynoUrls();
    if (ArrayUtils.isEmpty(pingDestinations)) {
      this.logger.warn('Dyno cardiac massage is enabled but no ping destinations are defined.');
      return;
    }

    for (const url of pingDestinations) {
      this.healthCheckService
        .check([(): Promise<HealthIndicatorResult> => this.dns.pingCheck(url, url)])
        .then((result) => this.logger.verbose(`Dyno cardiac massage for ${url} status=${result?.status}`))
        .catch((error) => this.logger.error(`Dyno cardiac massage failed for ${url} error: ${error}`));
    }
  }
}
