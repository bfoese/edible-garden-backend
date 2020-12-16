import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
  TypeOrmPingCheckSettings,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  public constructor(
    private healthCheckService: HealthCheckService,
    private typeormHealthIndicator: TypeOrmHealthIndicator
  ) {}

  /**
   * General health check for the application.
   *
   * TODO Extend with DNS check
   */
  @Get()
  @HealthCheck()
  public checkHealth(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      (): Promise<HealthIndicatorResult> =>
        this.typeormHealthIndicator.pingCheck('database', <TypeOrmPingCheckSettings>{ timeout: 1500 }),
    ]);
  }

  /**
   * The readiness probe will check if the database connection is healthy. These cases may occur:
   *
   * <ul>
   *     <li>Database is running and we can connect: HTTP 200 will be sent with a JSON stating database status=up will be sent.</li>
   *     <li>Database is down: HTTP 503 "Service Unavailable" will be sent.</li>
   *     <li>Database is up, but connection refused (e.g. wrong connection settings provided): Request will fail.</li>
   * </ul>
   */
  @Get('readiness')
  public checkReadiness(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      (): Promise<HealthIndicatorResult> =>
        this.typeormHealthIndicator.pingCheck('database', <TypeOrmPingCheckSettings>{ timeout: 1500 }),
    ]);
  }
}
