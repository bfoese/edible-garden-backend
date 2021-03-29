import { AuthenticationE2EService } from '@eg-app/e2e/service/authentication-e2e.service';
import { FetchedEmail } from '@eg-app/imap/fetched-email';
import { Injectable } from '@nestjs/common';

import { E2EEmailDto } from './dto/e2e-email.dto';
import { E2EEmailDtoMapper } from './mapper/e2e-email-dto.mapper';

@Injectable()
export class AuthenticationE2EFacadeService {
  public constructor(
    private authenticationE2eService: AuthenticationE2EService,
    private readonly e2eEmailDtoMapper: E2EEmailDtoMapper
  ) {}

  public fetchWorkflowEmails(recipientEmail: string, since: string | Date): Promise<E2EEmailDto[]> {
    return this.authenticationE2eService
      .fetchWorkflowEmails(recipientEmail, since)
      .then((data: FetchedEmail[]) => data.map((entity: FetchedEmail) => this.e2eEmailDtoMapper.toDto(entity)));
  }
}
