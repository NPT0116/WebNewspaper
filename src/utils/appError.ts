export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public errors: Array<{ param: string; msg: string }>;

  constructor(message: string, statusCode: number, errors: Array<{ param: string; msg: string }> = []) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors; // Thêm thuộc tính `errors` để lưu trữ danh sách lỗi

    Error.captureStackTrace(this, this.constructor);
  }
}
