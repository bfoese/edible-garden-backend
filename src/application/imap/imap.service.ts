import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { FetchedEmail } from './fetched-email';
import { ImapModuleOptions } from './imap-module.options';
import { ImapSearchOptions } from './imap-search-options';
import { IMAP_MODULE_OPTIONS } from './imap.constants';
import { ImapConnection } from './interfaces/imap-connection.interface';

import Imap = require('imap');
type ImapParsedHeader = { date: Date[]; subject: string[]; from: string[]; to: string[]; };

/**
 * At this point this service is only used for the E2E module. The way the
 * ImapService handles the IMAP connection must be reconsidered when it is
 * needed for other use cases. Email account providers may limit the number of
 * simultaneous connections to an IMAP account. GMail for example seems to have
 * a limit of 15 connections. Depending on the use case, a connection should be
 * kept open for multiple requests (underlying API supports subscriptions to
 * inboxes) and/or be closed after use. The current implmentation will result in
 * one connection to be established per request. This connection will be closed
 * or even forcefully destroyed when the request is fulfilled.
 */
@Injectable()
export class ImapService {
  private readonly logger = new Logger(ImapService.name);

  public constructor(@Inject(IMAP_MODULE_OPTIONS) private options: ImapModuleOptions) {}

  /**
   * @returns An imap connection object which can be used to establish a
   * connection.
   */
  private createImap(): ImapConnection {
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
    const resultOrError = new Promise((resolve, reject) => {
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
            this.parseEmails(imap, results)
              .then((parsedEmails: FetchedEmail[]) => resolve(parsedEmails))
              .catch((err) => reject(err));
          });
        });
      });

      imap.once('error', (err) => {
        this.logger.log(`Connection error: ${err}`);
        reject('Connection error: ' + err);
      });

      imap.once('end', () => {
        this.logger.log(`Connection ended.`);
      });

      imap.once('close', (err) => {
        this.logger.log(`Connection closed. Error: ${err}`);
        reject('Connection closed: Error: ' + err);
      });
      imap.connect();
    });

    return new Promise((resolve, reject) => {
      resultOrError
        .then((result: FetchedEmail[]) => {
          resolve(result);
          this.closeConnection(imap);
        })
        .catch((error) => {
          reject(error);
          this.closeConnection(imap);
        });
    });
  }

  private closeConnection(imapConnection: ImapConnection): void {
    if (imapConnection) {
      try {
        imapConnection.closeBox(false, () => imapConnection.end());
      } catch (err) {
        this.logger.log(
          `An error occured while attemting to close the connection. Connection will be destroyed with force. Error: ${err}`
        );
        imapConnection.destroy();
      }
    }
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
                parsedEmails.set(seqno, Object.assign(parsedEmails.get(seqno) ?? {}, { body: buffer } as FetchedEmail));
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
