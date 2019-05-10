import bodyParser from 'body-parser';
import { Router } from 'express';
import ApplicationAPI from './appdev/ApplicationAPI';
import CreateAppRouter from './routers/CreateAppRouter';
import CreateUserRouter from './routers/CreateUserRouter';
import GetAppsRouter from './routers/GetAppsRouter';
import HelloWorldRouter from './routers/HelloWorldRouter';
import SendNotificationRouter from './routers/SendNotificationRouter';
import UpdateUserRouter from './routers/UpdateUserRouter';

class API extends ApplicationAPI {
  getPath(): string {
    return '/api/';
  }

  middleware(): any[] {
    return [
      bodyParser.json(),
    ];
  }

  routerGroups(): { [index: string]: Router[] } {
    return {
      v1: [
        CreateAppRouter,
        CreateUserRouter,
        GetAppsRouter,
        HelloWorldRouter,
        SendNotificationRouter,
        UpdateUserRouter
      ],
    };
  }
}

export default API;