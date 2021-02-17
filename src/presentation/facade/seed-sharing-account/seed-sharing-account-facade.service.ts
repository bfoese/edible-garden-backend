import { UserService } from '@eg-data-access/user/user.service';
import { User } from '@eg-domain/user/user';
import { UserFindOptions } from '@eg-domain/user/user-find-options';
import { Injectable } from '@nestjs/common';

import { SeedSharingAccountDto } from './dto/seed-sharing-account.dto';
import { SeedSharingAccountMapper } from './mapper/seed-sharing-account.mapper';

@Injectable()
export class SeedSharingAccountFacadeService {
  public constructor(
    private userService: UserService,
    private readonly seedSharingAccountMapper: SeedSharingAccountMapper
  ) {}

  public getSettings(usernameOrEmail: string): Promise<SeedSharingAccountDto> {
    return this.userService
      .findByUsernameOrEmail(usernameOrEmail, {
        withHiddenFields: { email: true },
      } as UserFindOptions)
      .then((entity: User) => this.seedSharingAccountMapper.toDto(entity));
  }
}
