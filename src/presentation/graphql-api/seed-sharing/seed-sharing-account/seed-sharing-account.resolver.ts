import { CurrentUser } from '@eg-auth/decorators/current-user.decorator';
import { User } from '@eg-domain/user/user';
import { PatchSeedSharingAccountDto } from '@eg-presentation-facade/seed-sharing-account/dto/patch-seed-sharing-account.dto';
import { SeedSharingAccountDto } from '@eg-presentation-facade/seed-sharing-account/dto/seed-sharing-account.dto';
import { SeedSharingAccountFacadeService } from '@eg-presentation-facade/seed-sharing-account/seed-sharing-account-facade.service';
import { Args, Mutation, Query, QueryOptions, Resolver } from '@nestjs/graphql';

@Resolver(() => SeedSharingAccountDto)
export class SeedSharingAccountResolver {
  public constructor(private readonly seedSharingAccountFacadeService: SeedSharingAccountFacadeService) {}

  @Query(() => SeedSharingAccountDto, { name: 'accountSettings' } as QueryOptions)
  public async getSettings(@CurrentUser() user: User): Promise<SeedSharingAccountDto> {
    return this.seedSharingAccountFacadeService.getSettings(user?.username);
  }

  @Mutation(() => SeedSharingAccountDto, { name: 'patchAccountSettings' } as QueryOptions)
  public async patchSettings(
    @CurrentUser() user: User,
    @Args('patchData', { type: () => PatchSeedSharingAccountDto }) patchData: PatchSeedSharingAccountDto
  ): Promise<SeedSharingAccountDto> {
    return this.seedSharingAccountFacadeService.patchSettings(user, patchData);
  }
}
