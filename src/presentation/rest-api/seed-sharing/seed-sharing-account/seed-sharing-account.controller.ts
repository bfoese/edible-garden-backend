import { CurrentUser } from '@eg-auth/decorators/current-user.decorator';
import { User } from '@eg-domain/user/user';
import { PatchSeedSharingAccountDto } from '@eg-presentation-facade/seed-sharing-account/dto/patch-seed-sharing-account.dto';
import { SeedSharingAccountDto } from '@eg-presentation-facade/seed-sharing-account/dto/seed-sharing-account.dto';
import { SeedSharingAccountFacadeService } from '@eg-presentation-facade/seed-sharing-account/seed-sharing-account-facade.service';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('seed-sharing', 'Seed Sharing Account')
@Controller('v1/seed-sharing/account')
export class SeedSharingAccountController {
  public constructor(private readonly seedSharingAccountFacadeService: SeedSharingAccountFacadeService) {}

  @Get('settings')
  public async getSettings(@CurrentUser() user: User): Promise<SeedSharingAccountDto> {
    return this.seedSharingAccountFacadeService.getSettings(user?.username);
  }

  @Patch('settings')
  public async patchSettings(
    @CurrentUser() user: User,
    @Body() patchData: PatchSeedSharingAccountDto
  ): Promise<SeedSharingAccountDto> {
    return this.seedSharingAccountFacadeService.patchSettings(user, patchData);
  }
}
