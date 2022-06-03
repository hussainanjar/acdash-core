import { Request } from 'express-serve-static-core';
import { IncomingHttpHeaders } from 'http';

export interface IAppHeaders extends IncomingHttpHeaders {}

export interface IAppRequest extends Request {
  userJwt: string;
  userId: number;
  userEmail: string;
  userData: undefined;
  userJwtDecoded: undefined | Record<string, unknown> | string | undefined;
}
