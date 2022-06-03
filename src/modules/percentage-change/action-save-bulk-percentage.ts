import { HttpError } from '../../types/http-error';
import { BaseValidationType } from '../../types/validators';
import { IAppResponse } from '../../types/app-response';
import { IAppRequest } from '../../types/app-request';
import { body } from 'express-validator';
import dayjs, { Dayjs } from 'dayjs';
import { catchAsyncErrors } from '../../utils/catchAsyncErrors';
import { reqValidationResult } from '../../config/server/middlewares/req-validation-result';
import { getPercentageChangeData } from './action-get-percentage-data';
import { logger } from '../../utils/logger';

interface IReq extends IAppRequest {
  body: {
    startDate: Date;
    endDate: Date;
  };
}

export interface IRes extends IAppResponse {
  send: (body: any) => this;
}

const validator: BaseValidationType = [body('startDate').exists(), body('endDate').exists(), reqValidationResult];

export async function action(req: IReq, res: IRes): Promise<any> {
  try {
    const { startDate, endDate } = req.body;

    const newStartDate: Dayjs = dayjs(startDate);
    const newEndDate: Dayjs = dayjs(endDate);

    const differece: number = newEndDate.diff(newStartDate, 'day');
    for (let i: number = 0; i <= differece; i++) {
      const startDate: Dayjs = newStartDate.add(i, 'day');

      await getPercentageChangeData(startDate);
    }

    return res.status(200).json({ message: 'percentage created' });
  } catch (error) {
    const errorMsg: string = `actionSaveBulkPercentage - Error: ${error.message}, ${error.stack}`;
    logger.error(errorMsg);
    res.status(500).json(new HttpError(500, 'something went wrong'));
  }
}

export const actionSaveBulkPercentage: any[] = [validator, catchAsyncErrors(action)];
