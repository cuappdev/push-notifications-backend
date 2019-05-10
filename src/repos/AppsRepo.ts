import { getConnectionManager, Repository } from 'typeorm';

import App from '../entities/App';

const db = (): Repository<App> => getConnectionManager().get().getRepository(App);

const getAllApps = async (): Promise<App[]> => {
  try {
    return await db().find();
  } catch (e) {
    throw Error('Unable to fetch all apps')
  }
}

const getOrCreateAppWithName = async (name: string): Promise<App> => {
  try {
    // If app with name already exists, just return that one.
    const existingApp = await db().findOne({ name });
    if (existingApp) return existingApp;

    // Otherwise create new app with name.
    const app = db().create({ name });
    await db().save(app);
    return app;
  } catch (e) {
    throw Error(`Unable to get or create app with name ${name}`);
  }
};

export default {
  getAllApps,
  getOrCreateAppWithName
};