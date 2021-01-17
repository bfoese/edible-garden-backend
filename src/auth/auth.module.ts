import { CoreFacadeModule } from '@eg-core/facade/core-facade.module';
import { DataAccessModule } from '@eg-data-access/data-access.module';
import { HashingModule } from '@eg-hashing/hashing.module';
import { RefreshTokenCacheModule } from '@eg-refresh-token-cache/refresh-token-cache.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthenticationService } from './authentication.service';
import { AuthenticationFacadeService } from './presentation/facade/autentication-facade.service';
import { RegisterUserMapper } from './presentation/facade/mapper/register-user.mapper';
import { UserMapper } from './presentation/facade/mapper/user.mapper';
import { AuthenticationController } from './presentation/rest-api/authencation.controller';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    DataAccessModule,
    PassportModule,
    CoreFacadeModule,
    JwtModule.register({
      secret: process.env.BFEG_JWT_SECRET,
      signOptions: { expiresIn: process.env.BFEG_JWT_EXPIRATION_TIME },
    }),
    RefreshTokenCacheModule,

    HashingModule.register({ saltRounds: 10, pepper: process.env.BFEG_AUTH_HASHING_PEPPER }),
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    RegisterUserMapper,
    UserMapper,
    AuthenticationFacadeService,
  ],
  controllers: [AuthenticationController],
})
export class AuthModule {}
