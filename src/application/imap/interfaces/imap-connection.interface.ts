import { Mailbox } from './mailbox.interface';

export interface ImapConnection {
  /**
   * @param eventName -
   * @param callback -
   */
  once(eventName: 'ready' | 'error' | 'end' | 'close', callback: (error?: Error) => void);

  /**
   * Attempts to connect and authenticate with the IMAP server
   */
  connect(): void;

  /**
   *  Closes the connection to the server after all requests in the queue have
   *  been sent.
   */
  end(): void;

  /**
   * Immediately destroys the connection to the server.
   */
  destroy();

  /**
   * Opens a specific mailbox that exists on the server.
   * mailboxName should include any necessary prefix/path. modifiers is used by
   * IMAP extensions.
   *
   * @param mailboxName -
   * @param openReadonly -
   * @param callback -
   */
  openBox(mailboxName: string, openReadonly?: boolean, callback?: (error: Error, mailbox: Mailbox) => void): void;

  /**
   * Closes the currently open mailbox. If autoExpunge is
   * true, any messages marked as Deleted in the currently open mailbox will be
   * removed if the mailbox was NOT opened in read-only mode. If autoExpunge is
   * false, you disconnect, or you open another mailbox, messages marked as
   * Deleted will NOT be removed from the currently open mailbox.
   *
   * @param autoExpunge -
   * @param callback -
   */
  closeBox(autoExpunge?: boolean, callback?: (error: Error) => void): void;

  /**
   * Searches the currently open mailbox for messages using given criteria.
   * criteria is a list describing what you want to find.
   * @param criteria - For criteria types that require arguments, use an array
   * instead of just the string criteria type name (e.g. ['FROM',
   * 'foo\@bar.com']). Prefix criteria types with an "!" to negate
   * @param callback -
   */
  search(criteria: [string | [string, string]], callback: (error: Error, results: any) => void): void;
}
