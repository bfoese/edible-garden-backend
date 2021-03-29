import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { FetchedEmail } from './fetched-email';
import { ImapModuleOptions } from './imap-module.options';
import { ImapSearchOptions } from './imap-search-options';
import { IMAP_MODULE_OPTIONS } from './imap.constants';

import Imap = require('imap');

type ImapParsedHeader = { date: Date[]; subject: string[]; from: string[]; to: string[]; };

@Injectable()
export class ImapService {
  private readonly logger = new Logger(ImapService.name);

  public constructor(@Inject(IMAP_MODULE_OPTIONS) private options: ImapModuleOptions) {}

  private createImap(): any {
    return new Imap({
      user: this.options.userEmail,
      password: this.options.userCredentials,
      host: this.options.host,
      port: this.options.port,
      tls: this.options.tls,
      tlsOptions: this.options.tlsOptions,
    });
  }

  /**
   *
   * @param imap - Imap connection object
   * @param opts - Options to be used to filter the emails to be fetched from the inbox
   * @returns
   */
  public async fetchEmailsFromInbox(opts: ImapSearchOptions): Promise<FetchedEmail[]> {

    const imap = this.createImap();
    return new Promise((resolve, reject) => {
      imap.once('ready', () => {
        imap.openBox('INBOX', true, (err) => {
          if (err) {
            this.logger.log(`Imap openBox: ${err}`);
            reject('Failed to open inbox: ' + err);
          }
          imap.search(ImapSearchOptions.parseForApi(opts), (err, results) => {
            if (err) {
              this.logger.log(`Imap search error: ${err}`);
              reject('Search failed: ' + err);
            }
            this.parseEmails(imap, results).then((parsedEmails: FetchedEmail[]) => resolve(parsedEmails)).catch((err) => reject(err));
          });
        });
      });

      imap.once('error', (err) => {
        this.logger.log(`Connection error: ${err}`);
        reject('Connection error: ' + err);
      });

      imap.once('end', () => {
        // Emitted when connection is ended. This is just a fallback in case
        // imap.once('ready') had not already resolved/rejected the Promise, as
        // there might be other events being thrown (preventing this method to never
        // resolve). It is safe to call resolve/reject multiple times on an
        // Promise, there will be no error, no warning and no consecutive
        // invocation of 'then'. Only the first resolved/rejected result of the
        // Promise will result in an invocation of 'then'.
        resolve(undefined);
      });

      imap.once('close', (err) => {
        this.logger.log(`Connection error: ${err}`);
        reject('Connection error: ' + err);
      });
      imap.connect();
    });
  }

  private parseEmails(imap: any, imapSearchResult: any): Promise<FetchedEmail[]> {
    const parsedEmails: Map<number, FetchedEmail> = new Map();

    return new Promise((resolve, reject) => {
      try {
        // bodies is a query of what should be fetched
        const emailDataStream = imap.fetch(imapSearchResult, {
          bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
          struct: true,
        });

        emailDataStream.on('message', (msg, seqno: number) => {
          msg.on('body', (stream, info) => {
            let buffer = '';
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
            stream.once('end', () => {
              if (info.which !== 'TEXT') {
                const header: ImapParsedHeader = Imap.parseHeader(buffer);
                const appendData = {
                  from: header?.from ? header.from[0] : undefined,
                  to: header?.to ? header.to[0] : undefined,
                  subject: header?.subject ? header.subject[0] : undefined,
                  date: header?.date ? header.date[0] : undefined,
                } as FetchedEmail;
                parsedEmails.set(seqno, Object.assign(parsedEmails.get(seqno) ?? {}, appendData));
              } else {
                parsedEmails.set(
                  seqno,
                  Object.assign(parsedEmails.get(seqno) ?? {}, { body: buffer } as FetchedEmail)
                );
              }
            });
          });
        });

        emailDataStream.once('error', (err) => {
          this.logger.log(`Streaming error: ${err}`);
          reject('Streaming error: ' + err);
        });

        emailDataStream.once('end', () => {
          imap.end();
          resolve(Array.from(parsedEmails.values()));
        });
      } catch (err) {
        this.logger.log(`Fetch failed: ${err}`);
        reject(new NotFoundException('Provided filter not matching any emails'));
      }
    });
  }
}
