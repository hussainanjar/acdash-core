import { NextFunction, Request, Response } from 'express-serve-static-core';
import { SanitizationChain, ValidationChain } from 'express-validator';

type ReqValidationResultType = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export type BaseValidationType = (ValidationChain | SanitizationChain | ReqValidationResultType)[];
