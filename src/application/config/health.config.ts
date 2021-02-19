import { registerAs } from '@nestjs/config';

export default registerAs('health', () => ({
  cardiacMassageDynoEnabled: (): boolean => process.env.BFEG_CARDIAC_MASSAGE_DYNO_ENABLED === 'true',
  cardiacMassageDynoUrls: (): string[] => {
    const envValue: string = process.env.BFEG_CARDIAC_MASSAGE_DYNO_URLS || '';
    const envValues: string[] = envValue.split(',');
    return envValues;
  },
}));
