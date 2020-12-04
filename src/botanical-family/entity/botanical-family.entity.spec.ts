import { TestObjectFactory } from '@eg-core/test/test-object.factory';
import { ok } from 'assert';
import { assert } from 'console';
import { BotanicalFamilyI18nEntity } from './botanical-family-i18n.entity';
import { BotanicalFamilyEntity } from './botanical-family.entity';

describe('Botanical Family Entity', () => {
  const whitelistLocales = ['de_DE', 'en_US', 'fr_FR'];
  const blacklistLocale = 'de_AT';

  let botanicalFamily: BotanicalFamilyEntity;

  let i18nData: BotanicalFamilyI18nEntity[];
  let originalI18nDataLength: number;

  beforeEach(async () => {
    i18nData = [
      TestObjectFactory.of(BotanicalFamilyI18nEntity, {
        name: 'Some Translation',
        languageCode: 'de_DE',
      }),
      TestObjectFactory.of(BotanicalFamilyI18nEntity, {
        name: 'Some Translation',
        languageCode: 'en_US',
      }),
    ];

    originalI18nDataLength = i18nData.length;

    botanicalFamily = TestObjectFactory.of(BotanicalFamilyEntity, {
      botanicalName: 'Latin name',
    });
  });

  describe('Adding a translation', () => {
    it('should work case insensitive', async () => {
      botanicalFamily.i18nData = i18nData;
      assert(botanicalFamily.i18nData.length === originalI18nDataLength);

      const newI18nNames = {
        fr_fr: 'Bonjour monde',
      };

      botanicalFamily.addOrUpdateI18nNames(whitelistLocales, newI18nNames);
      expect(botanicalFamily.i18nData.length).toBe(originalI18nDataLength + 1);
      expect(botanicalFamily.i18nData.find((data) => data.languageCode === 'fr_FR')).toBeTruthy();
    });

    it('should retain the original translations for non-whitelisted language codes', async () => {
      botanicalFamily.i18nData = i18nData;
      assert(botanicalFamily.i18nData.length === originalI18nDataLength);

      const newI18nNames = {
        blacklistLocale: 'Leiwand',
      };

      botanicalFamily.addOrUpdateI18nNames(whitelistLocales, newI18nNames);
      expect(botanicalFamily.i18nData.length).toBe(originalI18nDataLength);
      expect(botanicalFamily.i18nData.find((data) => data.languageCode === blacklistLocale)).toBeFalsy();
    });

    it('should handle empty or null gracefully', async () => {
      botanicalFamily.i18nData = i18nData;
      assert(botanicalFamily.i18nData.length === originalI18nDataLength);

      botanicalFamily.addOrUpdateI18nNames(whitelistLocales, null);
      ok('null can be handled');
      expect(botanicalFamily.i18nData.length).toBe(originalI18nDataLength);

      botanicalFamily.addOrUpdateI18nNames(whitelistLocales, {});
      ok('empty can be handled');
      expect(botanicalFamily.i18nData.length).toBe(originalI18nDataLength);

      botanicalFamily.addOrUpdateI18nNames(null, { fr_FR: 'interdit' });
      ok('whitelist null can be handled');
      expect(botanicalFamily.i18nData.length).toBe(originalI18nDataLength);
    });
  });

  describe('Removing a translation', () => {
    it('should work case insensitive', async () => {
      botanicalFamily.i18nData = i18nData;
      assert(botanicalFamily.i18nData.length >= 2);
      const removeLanguageCode1 = botanicalFamily.i18nData[0].languageCode.toLowerCase();
      const removeLanguageCode2 = botanicalFamily.i18nData[1].languageCode.toUpperCase();

      botanicalFamily.removeI18nNames([removeLanguageCode1, removeLanguageCode2]);
      expect(botanicalFamily.i18nData.length).toBe(originalI18nDataLength - 2);
    });

    it('should retain the original translations for unknown language codes', async () => {
      botanicalFamily.i18nData = i18nData;
      assert(botanicalFamily.i18nData.length >= 1);

      botanicalFamily.removeI18nNames(['nonsense']);
      expect(botanicalFamily.i18nData.length).toBe(originalI18nDataLength);
    });

    it('should handle empty or null gracefully', async () => {
      botanicalFamily.i18nData = null;
      const removeLanguageCode = 'foo';

      botanicalFamily.removeI18nNames([removeLanguageCode]);
      ok('i18nData null can be handled');

      botanicalFamily.i18nData = [];
      botanicalFamily.removeI18nNames([removeLanguageCode]);
      ok('i18nData empty can be handled');

      botanicalFamily.i18nData = i18nData;
      botanicalFamily.removeI18nNames(null);
      ok('remove null can be handled');
      expect(botanicalFamily.i18nData.length).toBe(originalI18nDataLength);

      botanicalFamily.i18nData = i18nData;
      botanicalFamily.removeI18nNames([]);
      ok('remove empty can be handled');
      expect(botanicalFamily.i18nData.length).toBe(originalI18nDataLength);
    });
  });
});
