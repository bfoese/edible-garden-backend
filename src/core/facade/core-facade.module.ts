import { Module } from '@nestjs/common';

import { EntityInfoMapper } from './mapper/entity-info.mapper';
import { UserMapper } from './mapper/user.mapper';

@Module({ providers: [EntityInfoMapper, UserMapper], exports: [EntityInfoMapper, UserMapper] })
export class CoreFacadeModule {}
