import { StringUtil } from '@eg-common/util/string.util';

/**
 * For more supported options:
 * @see https://github.com/mscdex/node-imap
 */
export class ImapSearchOptions {
  /**
   * Messages that contain the specified string in the FROM field
   */
  public from?: string;

  public to?: string;

  /**
   * Messages whose internal date (disregarding time and timezone) is within or later than the specified date.
   *
   * Date or a string that can be parsed as a date.
   */
  public since?: Date | string;

  public constructor(instance: ImapSearchOptions) {
    Object.assign(this.from, instance);
  }

  /**
   * @returns Parsed result can be provided for imap.search()
   */
  public static parseForApi(opts: ImapSearchOptions): [[string, string]] | undefined {
    const result = [];
    if (!opts) {
      return undefined;
    }

    const mapKeyword = (key): string | undefined => {
      switch (key) {
        case 'from':
          return 'FROM';
        case 'to':
          return 'TO';
        case 'since':
          return 'SINCE';
      }
      return undefined;
    };

    Object.keys(opts).forEach((key) => {
      const value = opts[key];
      if (value !== undefined && value !== null && (typeof value !== 'string' || !StringUtil.isEmpty(value))) {
        result.push([mapKeyword(key), opts[key]]);
      }
    });

    return result && result.length > 0 ? (result as any) : undefined;
  }
}
