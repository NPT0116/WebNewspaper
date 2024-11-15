import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/appError.js';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Lấy danh sách lỗi dưới dạng mảng các đối tượng { param, msg }
    const errorArray = errors.array().map((err) => ({
      param: err.type,
      msg: err.msg
    }));
    // Tạo đối tượng AppError với danh sách lỗi
    return next(new AppError('Validation failed', 400, errorArray));
  }
  next();
};
