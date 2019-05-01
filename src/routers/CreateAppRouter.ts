import { Request } from 'express';

import { SerializedApp } from '../common/types';
import ApplicationRouter from '../appdev/ApplicationRouter';
import AppsRepo from '../repos/AppsRepo';

class CreateAppRouter extends ApplicationRouter<SerializedApp> {
  constructor() {
    super('POST');
  }

  getPath() {
    return '/apps/create/';
  }

  async content(req: Request): Promise<SerializedApp> {
    const { name } = req.body;
    const app = await AppsRepo.getOrCreateAppWithName(name);
    return app.serialize();
  }
}

export default new CreateAppRouter().router;