import { JwtAuthGuard } from '@eg-auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@eg-auth/strategies/request-with-user';
import { SeedSharingAccountDto } from '@eg-presentation-facade/seed-sharing-account/dto/seed-sharing-account.dto';
import { SeedSharingAccountFacadeService } from '@eg-presentation-facade/seed-sharing-account/seed-sharing-account-facade.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('seed-sharing', 'Seed Sharing Account')
@Controller('v1/seed-sharing/account')
export class SeedSharingAccountController {
  public constructor(private readonly seedSharingAccountFacadeService: SeedSharingAccountFacadeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('settings')
  public async getSettings(@Req() req: RequestWithUser): Promise<SeedSharingAccountDto> {
    const user = await req.user;
    return this.seedSharingAccountFacadeService.getSettings(user?.username);
  }
}
