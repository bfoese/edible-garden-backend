import { Public } from '@eg-auth/decorators/public-endpoint.decorator';
import { Controller, Delete, Get, HttpCode, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { AuthenticationE2EFacadeService } from '../facade/authentication-e2e-facade.service';
import { E2EEmailDto } from '../facade/dto/e2e-email.dto';

@ApiTags('Authentication E2E')
@Controller('v1/e2e/auth')
export class AuthenticationE2EController {
  public constructor(private readonly authenticationE2EFacadeService: AuthenticationE2EFacadeService) {}

  @Public()
  @Get('emails')
  @ApiQuery({
    name: 'since',
    required: false,
    type: 'date',
    example: '2021-01-30',
    description:
      'Filters emails whose internal date (disregarding time and timezone) is within or later than the specified date. Provided time/timezone are being completely ignored.',
  })
  public async findEmails(
    @Query('recipientEmail') recipientEmail: string,
    @Query('since') since: Date
  ): Promise<E2EEmailDto[]> {
    return this.authenticationE2EFacadeService.fetchWorkflowEmails(recipientEmail, since);
  }

  @ApiQuery({
    name: 'email',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'username',
    required: false,
    type: 'string',
  })
  @Public()
  @HttpCode(200)
  @Delete('account')
  public async deleteAccountWithoutAuthentication(
    @Query('email') email: string,
    @Query('username') username: string
  ): Promise<any> {
    return this.authenticationE2EFacadeService.deleteAccount(email ?? username);
  }
}
