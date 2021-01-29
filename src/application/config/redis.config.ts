import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  url: process.env.BFEG_REDIS_URL,
}));
