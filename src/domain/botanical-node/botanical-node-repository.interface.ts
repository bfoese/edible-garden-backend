import { BotanicalNode } from './botanical-node';

export interface BotanicalNodeRepository {
  findOne(id: string): Promise<BotanicalNode>;

  /**
   * @param i18nLang - When provided, the i18n entries of the nodes and child nodes will be filtered to contain only the given language.
   */
  getTree(i18nLang: string | undefined): Promise<BotanicalNode[]>;
}
