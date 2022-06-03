import http from 'http';

export class HttpError extends Error {
  errors: any[];
  code: number;
  message: string;
  msg: string;
  name: 'HttpError';

  /**
   * Creates an instance of HttpError.
   * @param {number} code
   * @param {string} message
   * @param {array} errors
   * @memberOf HttpError
   */
  constructor(status?: number, message?: string, errors?: any[]) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    //if (errors && errors.length > 0) this.errors = errors || [];
    this.code = status || 500;
    this.msg = message || http.STATUS_CODES[this.code] || 'Error';
  }
}
