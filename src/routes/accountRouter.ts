// src/routes/userRouter.ts
import express from 'express';
import { registerUser, loginUser, logoutUser, loginGithub, githubLoginSuccess, githubCallbackFunction } from '../controllers/accountController.js';
import { PATH } from '../config/path.js';
import { registerValidationRules } from '~/validator/registerUserValidator.js';
import { validateRequest } from '~/middlewares/validateUserRegister.js';

const accountRouter = express.Router();

// Đăng ký người dùng
accountRouter.post(
  PATH.ACCOUNT.OUTLET.register,
  registerValidationRules, // Middleware để xác thực dữ liệu đầu vào
  validateRequest, // Middleware để kiểm tra kết quả xác thực
  registerUser // Hàm xử lý đăng ký người dùng
);
// Đăng nhập người dùng
accountRouter.post(PATH.ACCOUNT.OUTLET.login, loginUser);

// Đăng xuất người dùng
accountRouter.post(PATH.ACCOUNT.OUTLET.logout, logoutUser);

accountRouter.get(PATH.ACCOUNT.OUTLET.github, loginGithub);
accountRouter.get(PATH.ACCOUNT.OUTLET.githubCallback, githubCallbackFunction, githubLoginSuccess);

export default accountRouter;
