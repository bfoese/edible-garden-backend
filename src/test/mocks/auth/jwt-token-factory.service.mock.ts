/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtAccountActionTokenPayload } from '@eg-auth/token-payload/jwt-account-action-token-payload.interface';
import { JwtTokenPayload } from '@eg-auth/token-payload/jwt-token-payload.interface';

const mockedJwtTokenFactoryService = {
  generateAccessToken: (_payload: JwtTokenPayload): string => 'accessToken',
  generateRefreshToken: (_payload: JwtTokenPayload): string => 'refreshToken',
  generateAccountActionToken: (_payload: JwtAccountActionTokenPayload): string => 'accountActionToken',
};

export default mockedJwtTokenFactoryService;
