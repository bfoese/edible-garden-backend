import { INestApplication, Injectable } from '@nestjs/common';

@Injectable()
export class AppInstanceService {
  private app: INestApplication;
  public constructor(app: INestApplication) {
    this.app = app;
  }

  public getUrl(): Promise<string> {
    return this.app.getUrl();
  }
}
