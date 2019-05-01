import { getConnectionManager, Repository } from 'typeorm';

import App from '../entities/App';
import User from '../entities/User';

const db = (): Repository<User> => getConnectionManager().get().getRepository(User);

const createUser = async (
  app: App,
  deviceToken: string,
  uuid: string
): Promise<User> => {
  try {
    const user = db().create({
      app,
      deviceToken,
      isNotificationsEnabled: true,
      uuid
    });
    await db().save(user);
    return user;
  } catch (e) {
    throw Error('Unable to create user');
  }
};

const getUserByUUID = async (uuid: string): Promise<User> => {
  try {
    return db().findOneOrFail({ uuid });
  } catch (e) {
    throw Error('Unable to find user');
  }
};

const updateDeviceTokenWithUUID = async (
  uuid: string,
  deviceToken: string,
): Promise<User> => {
  try {
    const user = await db().findOne({ uuid });
    user.deviceToken = deviceToken;
    user.isNotificationsEnabled = true;
    await db().save(user);
    return user;
  } catch (e) {
    throw Error('Failed to update user deviceToken');
  }
}

const updateIsNotificationsEnabledWithUUID = async (
  uuid: string,
  isNotificationsEnabled: boolean,
): Promise<User> => {
  try {
    const user = await db().findOne({ uuid });
    user.isNotificationsEnabled = isNotificationsEnabled;
    await db().save(user);
    return user;
  } catch (e) {
    throw Error('Failed to update user isNotificationsEnabled');
  }
}


export default {
  createUser,
  getUserByUUID,
  updateDeviceTokenWithUUID,
  updateIsNotificationsEnabledWithUUID,
};