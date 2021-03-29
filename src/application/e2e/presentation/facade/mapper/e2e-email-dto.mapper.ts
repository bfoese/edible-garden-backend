import { FetchedEmail } from '@eg-app/imap/fetched-email';
import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { Injectable } from '@nestjs/common';

import { E2EEmailDto } from '../dto/e2e-email.dto';

@Injectable()
export class E2EEmailDtoMapper implements DtoMapper<E2EEmailDto, FetchedEmail> {
  public toDto(entity: FetchedEmail): E2EEmailDto {
    if (entity) {
      const dto = new E2EEmailDto();
      dto.to = entity.to;
      dto.date = entity.date;
      dto.subject = entity.subject;
      dto.body = entity.body;
      return dto;
    }
    return undefined;
  }
}
