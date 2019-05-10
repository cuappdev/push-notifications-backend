import { Request } from 'express';

import { SerializedUser } from '../common/types';
import ApplicationRouter from '../appdev/ApplicationRouter';
import UsersRepo from '../repos/UsersRepo';

class UpdateUserRouter extends ApplicationRouter<SerializedUser> {
  constructor() {
    super('POST');
  }

  getPath() {
    return '/users/update/';
  }

  async content(req: Request): Promise<SerializedUser> {
    const { deviceToken, isNotificationsEnabled, uuid } = req.body;

    if (!uuid) throw Error('Missing required uuid');
    if (!deviceToken && isNotificationsEnabled === undefined) {
      throw Error('Either deviceToken or isNotificationsEnabled is required');
    }

    let user;
    if (deviceToken) {
      user = await UsersRepo.updateDeviceTokenWithUUID(uuid, deviceToken);
    }
    if (isNotificationsEnabled !== undefined) {
      user = await UsersRepo.updateIsNotificationsEnabledWithUUID(uuid, isNotificationsEnabled);
    }
    return user.serialize();
  }
}

export default new UpdateUserRouter().router;