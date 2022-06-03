/* eslint-disable @typescript-eslint/typedef */
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import 'dotenv/config';
import { IAppRequest } from '../../../types/app-request';
import { IAppResponse } from '../../../types/app-response';
import { NextFunction } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { appConfig } from '../../db/envResolver';
import { HttpError } from '../../../types/http-error';
import { sendHttpErrorModule } from '../error-handler/index';

export function configureMiddleware(app: Application): void {
  app.use(sendHttpErrorModule);

  app.use(logger('combined'));
  app.use(
    express.json({
      limit: '1024kb',
    }),
  );
  app.use(
    express.urlencoded({
      extended: false,
      limit: '1024kb',
    }),
  );
  app.use(cookieParser());
  app.use(cors());
  app.use(helmet());
  app.use(compression());
}

/**
 * @export
 * @param {Application} app
 */
export function initErrorHandler(app: Application): void {
  app.use((error: Error, req: IAppRequest, res: IAppResponse, next: NextFunction): void => {
    if (!appConfig.isTesting) {
      console.log(error.message);
    }

    // in case response is already sent
    if (res.headersSent) {
      return;
    }

    if (typeof error === 'number') {
      error = new HttpError(error); // next(404)
    }
    if (error instanceof HttpError) {
      res.sendHttpError(error);
    } else {
      if (appConfig.isDevelopment) {
        error = new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        res.sendHttpError(error);
      } else {
        error = new HttpError(StatusCodes.INTERNAL_SERVER_ERROR);
        res.sendHttpError(error, error.message);
      }
    }
  });
}
