import { Response } from 'express-serve-static-core';
import { HttpError } from './http-error';

interface IBaseAppResponse extends Response {}

export interface IAppResponse extends IBaseAppResponse {
  sendHttpError: (error: HttpError | Error, message?: string) => void;
}
