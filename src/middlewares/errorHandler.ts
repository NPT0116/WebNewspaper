import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/appError.js';

export const errorHandler: ErrorRequestHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    // Kiểm tra nếu có danh sách lỗi chi tiết
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors.length ? err.errors : undefined // Trả về `errors` nếu có
    });
    return;
  }

  // Xử lý các lỗi khác
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
};
