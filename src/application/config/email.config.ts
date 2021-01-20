import { registerAs } from '@nestjs/config';

export default registerAs(
  'email',
  () => ({
    transportUrl: (): string => process.env.BFEG_EMAIL_TRANSPORT_URL,
    enabled: (): boolean => process.env.BFEG_EMAIL_ENABLED === 'true',
    from: (): string => process.env.BFEG_EMAIL_DEFAULT_FROM
  }),
);
