/* eslint-disable @typescript-eslint/typedef */
import { Router as IRouter } from 'express-serve-static-core';
import { Router } from 'express';
import { actionSaveBulkPercentage } from './action-save-bulk-percentage';
const router: IRouter = Router();

router.post('/save-bulk-percentage', actionSaveBulkPercentage);

export { router as percentageRoutes };
