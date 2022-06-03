import { NextFunction, RequestHandler } from 'express-serve-static-core';
import { IAppRequest } from '../types/app-request';
import { IAppResponse } from '../types/app-response';

// Catch error that are throw inside route

export function catchAsyncErrors(fn: RequestHandler): RequestHandler {
  return (req: IAppRequest, res: IAppResponse, next: NextFunction): void => {
    const routePromise: any = fn(req, res, next);

    if (routePromise.catch) {
      routePromise.catch((err: Error): void => next(err));
    }
  };
}

export class CustomError extends Error {
  errorStatus: number = null;
  constructor(error: { errorStatus: number; message: string }) {
    super(error.message);
    this.errorStatus = error.errorStatus;
  }
}
