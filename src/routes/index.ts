import { Application } from 'express-serve-static-core';
import { percentageRoutes } from '../modules/percentage-change/route';

export function initRouter(app: Application): void {
  const prefix: string = '/api/v1/';

  app.use(prefix, percentageRoutes);
}
