import { Module } from '@nestjs/common';

import { EntityInfoMapper } from './mapper/entity-info.mapper';

@Module({ providers: [EntityInfoMapper], exports: [EntityInfoMapper] })
export class CoreFacadeModule {}
