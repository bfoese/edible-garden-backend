import authConfig from '@eg-app-config/auth.config';
import { CryptoModule } from '@eg-app/crypto/crypto.module';
import { CoreFacadeModule } from '@eg-core/facade/core-facade.module';
import { DataAccessModule } from '@eg-data-access/data-access.module';
import { HashingModule } from '@eg-hashing/hashing.module';
import { MailModule } from '@eg-mail/mail.module';
import { RefreshTokenCacheModule } from '@eg-refresh-token-cache/refresh-token-cache.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthenticationFacadeService } from './presentation/facade/authentication-facade.service';
import { JwtTokenDtoMapper } from './presentation/facade/mapper/jwt-token-dto.mapper';
import { SigninResonseDtoMapper } from './presentation/facade/mapper/signin-response-dto.mapper';
import { SignupUserDtoMapper } from './presentation/facade/mapper/signup-user-dto.mapper';
import { AuthenticationController } from './presentation/rest-api/authentication.controller';
import { AccountActionEmailService } from './service/account-action-email.service';
import { AuthenticationService } from './service/authentication.service';
import { JwtTokenFactoryService } from './service/jwt-token-factory.service';
import { GoogleStrategy } from './strategies/google-strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { SecureAccountActionStrategy } from './strategies/secure-account-action.strategy';
import { UserSerializer } from './strategies/user.serializer';

@Module({
  imports: [
    MailModule,
    DataAccessModule,
    PassportModule,
    CoreFacadeModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [authConfig.KEY],
      useFactory: (_authConfig: ConfigType<typeof authConfig>) => ({
        secret: _authConfig.jwtSecret(),
        signOptions: { expiresIn: _authConfig.jwtExpirationTime() },
      }),
    }),
    RefreshTokenCacheModule,

    HashingModule.register({ saltRounds: 10, pepper: process.env.BFEG_AUTH_HASHING_PEPPER }),
    CryptoModule.register({ secretKey: process.env.BFEG_PERSONAL_DATA_ENCRYPTION_KEY }),
  ],
  providers: [
    AuthenticationService,
    AccountActionEmailService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    SecureAccountActionStrategy,
    GoogleStrategy,
    JwtTokenDtoMapper,
    SignupUserDtoMapper,
    SigninResonseDtoMapper,
    AuthenticationFacadeService,
    UserSerializer,

    JwtTokenFactoryService,
  ],
  controllers: [AuthenticationController],
})
export class AuthModule {}
