import appConfig from '@eg-app/config/app.config';
import { ValidationException } from '@eg-app/exception/validation.exception';
import { UserService } from '@eg-data-access/user/user.service';
import { User } from '@eg-domain/user/user';
import { UserFindOptions } from '@eg-domain/user/user-find-options';
import { UserValidation } from '@eg-domain/user/user-validation';
import { Inject, Injectable } from '@nestjs/common';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { ConfigType } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';

import { PatchSeedSharingAccountDto } from './dto/patch-seed-sharing-account.dto';
import { SeedSharingAccountDto } from './dto/seed-sharing-account.dto';
import { PatchSeedSharingAccountDtoMapper } from './mapper/patch-seed-sharing-account-dto.mapper';
import { SeedSharingAccountDtoMapper } from './mapper/seed-sharing-account-dto.mapper';

@Injectable()
export class SeedSharingAccountFacadeService {
  public constructor(
    private userService: UserService,
    private readonly accountDtoMapper: SeedSharingAccountDtoMapper,
    private readonly patchAccountDtoMapper: PatchSeedSharingAccountDtoMapper,
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>
  ) {}

  public getSettings(usernameOrEmail: string): Promise<SeedSharingAccountDto> {
    return this.userService
      .findByUsernameOrEmail(usernameOrEmail, {
        withHiddenFields: { email: true },
      } as UserFindOptions)
      .then((entity: User) => this.accountDtoMapper.toDto(entity));
  }

  public async patchSettings(user: User, dto: PatchSeedSharingAccountDto): Promise<SeedSharingAccountDto> {
    let newData = { entityInfo: { id: user.entityInfo.id } } as User;
    newData = this.patchAccountDtoMapper.ontoEntity(dto, newData);

    await validateOrReject(plainToClass(User, newData), {
      groups: [UserValidation.groups.updateAccountSettings],
    } as ValidatorOptions).catch((errors: ValidationError[]) => {
      throw new ValidationException(errors);
    });
    return this.userService.save(newData).then((entity: User) => this.accountDtoMapper.toDto(entity));
  }
}
