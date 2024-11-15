// src/routes/userRouter.ts
import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/userController.js';
import { PATH } from '../config/path.js';
import { registerValidationRules } from '~/validator/registerUserValidator.js';
import { validateRequest } from '~/middlewares/validateUserRegister.js';

const userRouter = express.Router();

// Đăng ký người dùng
userRouter.post(
  PATH.USER.OUTLET.register,
  registerValidationRules, // Middleware để xác thực dữ liệu đầu vào
  validateRequest, // Middleware để kiểm tra kết quả xác thực
  registerUser // Hàm xử lý đăng ký người dùng
);
// Đăng nhập người dùng
userRouter.post(PATH.USER.OUTLET.login, loginUser);

// Đăng xuất người dùng
userRouter.post(PATH.USER.OUTLET.logout, logoutUser);

export default userRouter;
