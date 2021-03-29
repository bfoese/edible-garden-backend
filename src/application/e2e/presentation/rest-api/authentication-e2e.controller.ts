import { Public } from '@eg-auth/decorators/public-endpoint.decorator';
import { Controller, Get, Query } from '@nestjs/common';
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
    type: Date
  })
  public async findEmails(
    @Query('recipientEmail') recipientEmail: string,
    @Query('since') since: Date
  ): Promise<E2EEmailDto[]> {
    return this.authenticationE2EFacadeService.fetchWorkflowEmails(recipientEmail, since);
  }
}
