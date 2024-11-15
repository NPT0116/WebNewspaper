import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/appError.js';

export const errorHandler: ErrorRequestHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  // Ensure the function explicitly returns void
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors.length ? err.errors : undefined
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};
