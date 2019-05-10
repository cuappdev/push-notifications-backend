import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME, NODE_ENV } from '../utils/EnvUtils';
import { PRODUCTION } from '../common/constants';
import App from '../entities/App';
import User from '../entities/User';

const isProduction = NODE_ENV === PRODUCTION;

const entities = [App, User];

const connectionOptions: ConnectionOptions = {
  entities,
  type: 'postgres',
  host: DB_HOST,
  port: isProduction ? +DB_PORT : 5432,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  extra: {
    ssl: isProduction,
  },
};

const dbConnection = (): Promise<Connection> => createConnection(connectionOptions);

export default dbConnection;