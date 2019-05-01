import { Request } from 'express';

import ApplicationRouter from '../appdev/ApplicationRouter';

class HelloWorldRouter extends ApplicationRouter<any> {
  constructor() {
    super('GET');
  }

  getPath(): string {
    return '/';
  }

  async content(req: Request): Promise<string> {
    return 'Hello World!'
  }
}

export default new HelloWorldRouter().router;