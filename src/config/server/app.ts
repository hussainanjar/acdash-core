import express, { Application } from 'express';
import 'dotenv/config';
import { initRouter } from '../../routes';
import { configureMiddleware, initErrorHandler } from './middlewares';
import { errorHandler } from './error-handler';
import { associations } from '../../models/associations';
import execute from '../../job/index';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Init app
const app: Application = express();

// Initializing middleware
configureMiddleware(app);

// Inititializing router
initRouter(app);
associations();

// Initializing error handler middleware
initErrorHandler(app);
errorHandler(app);
execute();
export default app;
