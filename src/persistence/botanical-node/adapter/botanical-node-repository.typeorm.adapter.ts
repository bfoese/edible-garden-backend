import { StringUtil } from '@eg-common/util/string.util';
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { BotanicalNodeRepository } from '@eg-domain/botanical-node/botanical-node-repository.interface';
import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { BotanicalNodeTypeOrmRepository } from '../repository/botanical-node.typeorm-repository';

@Injectable()
export class BotanicalNodeRepositoryTypeOrmAdapter implements BotanicalNodeRepository {
  public constructor(private readonly botanicalNodeRepository: BotanicalNodeTypeOrmRepository) {}

  public findOne(id: string): Promise<BotanicalNode> {
    return this.botanicalNodeRepository.findOneOrFail(id);
  }

  public async getTree(i18nLang: string): Promise<BotanicalNode[]> {
    const nodes = await this.botanicalNodeRepository.find(<FindManyOptions>{
      relations: ['i18nData', 'children', 'children.i18nData', 'children.children', 'children.children.i18nData'],
      where: { parent: null }, // starts with roots and loads children
      // TODO enhance with conditions on i18nData relations
      // where: qb => { qb.where({ 'botanicalNode__i18nData.languageCode = :foo': {foo: 'de-DE'} })}, // does not work
      // where: qb => { qb.where({i18nData: {languageCode: 'de-DE'}} )}, // does not work
      // see https://github.com/typeorm/typeorm/issues/2707
    });

    // TODO replace this hacky post-filtering by proper queryBuilder implementation
    if (nodes && i18nLang) {
      nodes.forEach((node: BotanicalNode) => {
        node.i18nData = node.i18nData
          ? node.i18nData.filter((entity) => StringUtil.contains(entity.languageCode, i18nLang, false))
          : [];

        if (node.children) {
          node.children.forEach((child) => {
            child.i18nData = child.i18nData
              ? child.i18nData.filter((entity) => StringUtil.contains(entity.languageCode, i18nLang, false))
              : [];
          });
        }
      });
    }
    return nodes;
  }
}
