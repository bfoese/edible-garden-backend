import { ArrayUtils } from '@eg-common/util/array.utils';
import { StringUtil } from '@eg-common/util/string.util';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

import { LimitTokensPerUserOptions } from './limit-tokens-per-user.options';

@Injectable()
export class RefreshTokenCacheService {
  private static readonly TTL_INFINITY = 0;
  private static readonly KEY_NAMESPACE = 'RefreshToken';

  public constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  public get(username: string): Promise<string[] | null> {
    if (StringUtil.isEmpty(username)) {
      return Promise.resolve(null);
    }
    return this.cache.get(this.generateKey(username));
  }

  public removeAll(username: string): void {
    if (StringUtil.isEmpty(username)) {
      return;
    }
    const key = this.generateKey(username);
    this.cache.del(key);
  }

  public async removeOne(username: string, removeCandiate: string): Promise<boolean> {
    const userTokens = await this.get(username);
    if (ArrayUtils.isNotEmpty(userTokens)) {
      const reducedTokens = userTokens.filter((value: string) => value !== removeCandiate);

      if (userTokens.length !== reducedTokens.length) {
        await this.updateTokensForUser(username, reducedTokens);
        return true;
      }
    }
    return false;
  }

  public async contains(username: string, refreshToken: string): Promise<boolean> {
    const userTokens = await this.get(username);
    if (ArrayUtils.isNotEmpty(userTokens)) {
      return ArrayUtils.contains(userTokens, refreshToken);
    }
    return false;
  }

  public async add(
    username: string,
    refreshToken: string,
    limitTokensPerUser?: LimitTokensPerUserOptions
  ): Promise<string[] | null> {
    if (StringUtil.isEmpty(username) || StringUtil.isEmpty(refreshToken)) {
      return Promise.resolve(null);
    }

    let cachedTokens: string[] = (await this.get(username)) ?? [];
    if (ArrayUtils.contains(cachedTokens, refreshToken)) {
      return Promise.resolve(cachedTokens); // token already cached
    }

    // ensure that we do not exceed the maximum number of tokens per user: remove the oldest one
    if (limitTokensPerUser?.maxNoOfTokens > 0 && cachedTokens.length === limitTokensPerUser.maxNoOfTokens) {
      // if we have a reducer, use its logic otherwise remove the first added token (assuming here that our cache technology keeps the order of the items)
      const removeCandidate = limitTokensPerUser.maxNoOfTokensReducer
        ? cachedTokens.reduce(limitTokensPerUser.maxNoOfTokensReducer)
        : cachedTokens.shift();
      if (removeCandidate) {
        cachedTokens = cachedTokens.filter((value: string) => value !== removeCandidate);
      }
    }
    return await this.updateTokensForUser(username, ArrayUtils.pushDistinct(cachedTokens, refreshToken));
  }

  private updateTokensForUser(username: string, newTokens: string[]): Promise<string[]> {
    const key = this.generateKey(username);
    return this.cache.set(key, newTokens, { ttl: RefreshTokenCacheService.TTL_INFINITY } as CachingConfig);
  }

  private generateKey(username: string): string | null {
    if (StringUtil.isEmpty(username)) {
      return null;
    }
    return `${RefreshTokenCacheService.KEY_NAMESPACE}:${username}`;
  }
}
