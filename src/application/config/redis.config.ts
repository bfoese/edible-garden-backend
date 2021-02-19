import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  /**
   * In Heroku environment the Redis URL can change over time and we need to
   * use the environment variable provided by Heroku to access the Redis URL.
   * If the first probe does not give a result, we are probably not in Heroku
   * environment and then we fallback to the app configuration.
   *
   * You can find out the Heroku variable names by running 'heroku config' in
   * Heroku CLI.
   */
  url: process.env.REDIS_URL ?? process.env.BFEG_REDIS_URL,
}));
