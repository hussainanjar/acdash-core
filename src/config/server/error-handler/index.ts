import { Application, Request, Response } from 'express';
import { IAppResponse } from '../../../types/app-response';
import { NextFunction } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../../types/http-error';

export function errorHandler(app: Application): void {
  // error handler
  app.use((err: any, req: Request, res: Response, next: any) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  });
  app.use('*', (req, res, next) => {
    try {
      res.status(404).json({
        name: 'ResourceNotFoundError',
        error: `${req.method} ${req.baseUrl} does not exist`,
      });
    } catch (error) {
      res.json(error);
      next(error);
    }
  });
  app.use((err: any, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    if (err.name === 'UnauthorizedError') {
      res.status(401);
      res.json({ message: err.name + ': ' + err.message });
    } else {
      res.status(500).json(err);
      next();
    }
  });
}

export function sendHttpErrorModule(req: Request, res: IAppResponse, next: NextFunction): void {
  res.sendHttpError = (error: HttpError): void => {
    res.status(error.code || StatusCodes.INTERNAL_SERVER_ERROR);

    res.json({
      status: error.code,
      name: error.name,
      message: error.message,
      errors: error.errors,
    });
  };

  return next();
}
