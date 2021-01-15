import { CoreFacadeModule } from '@eg-core/facade/core-facade.module';
import { DataAccessModule } from '@eg-data-access/data-access.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HashingModule } from 'src/hashing/hashing.module';

import { AuthenticationService } from './authentication.service';
import { AuthenticationFacadeService } from './presentation/facade/autentication-facade.service';
import { RegisterUserMapper } from './presentation/facade/mapper/register-user.mapper';
import { AuthenticationController } from './presentation/rest-api/authencation.controller';
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
    HashingModule.register({ saltRounds: 10, pepper: process.env.BFEG_AUTH_HASHING_PEPPER }),
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy, RegisterUserMapper, AuthenticationFacadeService],
  controllers: [AuthenticationController],
})
export class AuthModule {}
