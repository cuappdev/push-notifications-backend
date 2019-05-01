import { Request } from 'express';

import { SerializedUser } from '../common/types';
import ApplicationRouter from '../appdev/ApplicationRouter';
import AppsRepo from '../repos/AppsRepo';
import UsersRepo from '../repos/UsersRepo';

class CreateUserRouter extends ApplicationRouter<SerializedUser> {
  constructor() {
    super('POST');
  }

  getPath() {
    return '/users/create/';
  }

  async content(req: Request): Promise<SerializedUser> {
    const { appName, deviceToken, uuid } = req.body;
    const app = await AppsRepo.getOrCreateAppWithName(appName);
    const user = await UsersRepo.createUser(app, deviceToken, uuid);
    return user.serialize();
  }
}

export default new CreateUserRouter().router;