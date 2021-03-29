import { StringUtil } from '@eg-common/util/string.util';
import { Builder } from 'builder-pattern';

import { ImapSearchOptions } from './imap-search-options';

describe('ImapSearchOptions', () => {
  const from = 'foo@bar.baz';
  const to = 'socrates@olymp.gr';
  const since = new Date();

  describe('parse options for API', () => {
    it('to contain all provided options in no specific order', async () => {
      const opts = Builder<ImapSearchOptions>().from(from).to(to).since(since).build();
      const apiOpts = ImapSearchOptions.parseForApi(opts);

      // sort the generated options by key to allow non-flaky comparison with expected value
      apiOpts.sort((a1: [string, string | Date], a2: [string, string | Date]) =>
        StringUtil.compare(a1.length > 0 ? a1[0] : undefined, a2.length > 0 ? a2[0] : undefined)
      );
      expect(apiOpts).toEqual([
        ['FROM', from],
        ['SINCE', since],
        ['TO', to],
      ]);
    });

    it('to contain the single provided option', async () => {
      const opts = Builder<ImapSearchOptions>().from(from).build();
      const apiOpts = ImapSearchOptions.parseForApi(opts);
      expect(apiOpts).toEqual([['FROM', from]]);
    });

    it('to contain the last value that the builder was provided with', async () => {
      const opts = Builder<ImapSearchOptions>().from(from).from('override').build();
      const apiOpts = ImapSearchOptions.parseForApi(opts);
      expect(apiOpts).toEqual([['FROM', 'override']]);
    });
  });
});
