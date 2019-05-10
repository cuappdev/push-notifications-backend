import { Request } from 'express';

import { SerializedApp } from '../common/types';
import ApplicationRouter from '../appdev/ApplicationRouter';
import AppsRepo from '../repos/AppsRepo';

class GetAppsRouter extends ApplicationRouter<SerializedApp[]> {
  constructor() {
    super('GET');
  }

  getPath() {
    return '/apps/';
  }

  async content(req: Request): Promise<SerializedApp[]> {
    const allApps = await AppsRepo.getAllApps();
    return allApps.map(app => app.serialize());
  }
}

export default new GetAppsRouter().router;