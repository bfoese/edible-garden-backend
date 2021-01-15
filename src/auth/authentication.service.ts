import { UserService } from '@eg-data-access/user/user.service';
import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { HashingService } from '../hashing/hashing.service';
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception';
import { JwtTokenDto } from './presentation/facade/dto/jwt-token.dto';
import { JwtTokenPayload } from './strategies/jwt-token-payload.interface';

@Injectable()
export class AuthenticationService {
  public constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService
  ) {}

  /**
   * @param user -
   */
  public async register(user: User): Promise<User> {
    const hashedPassword = await this.hashingService.createSaltedPepperedHash(user.password);
    const createdUser = await this.userService.create({
      ...user,
      password: hashedPassword, // override the plain text password with hashed one
    });
    return createdUser;
  }

  /**
   * Finds the user for the given credentials. If no user of the given name was
   * found or the provided password does not match the stored password of that
   * user, an error will be thrown that does NOT exposes details whether the
   * given user existed or not for security reasons.
   *
   * @param usernameOrEmail - name or email of the user
   * @param plainTextPassword - password of the user in plain text
   */
  public async validateUser(usernameOrEmail: string, plainTextPassword: string): Promise<User | undefined> {
    const password = await this.userService.getPasswordFromUser(usernameOrEmail);
    const passwordMatches = await this.hashingService.verifyHash(plainTextPassword, password);
    if (passwordMatches) {
      return this.userService.findByUsernameOrEmail(usernameOrEmail);
    }
    throw new InvalidCredentialsException(usernameOrEmail);
  }

  /**
   * Must be called for a validated user only.
   * @param user - validated user
   * @returns JwtToken for the user
   */
  public async login(user: User): Promise<JwtTokenDto> {
    const payload = { sub: user.username } as JwtTokenPayload;
    return {
      // had to provide secret and expiration time here again, even though its
      // configured already for the imported JwtModule - don't know why,
      // whithout it, no secret was found
      access_token: this.jwtService.sign(payload, {
        secret: process.env.BFEG_JWT_SECRET,
        expiresIn: process.env.BFEG_JWT_EXPIRATION_TIME,
      } as JwtSignOptions),
    } as JwtTokenDto;
  }
}
