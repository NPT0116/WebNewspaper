// src/routes/userRouter.ts
import express, { NextFunction, Response, Request } from 'express';

import { registerUser, loginUser, logoutUser, loginGithub, githubLoginSuccess, githubCallbackFunction } from '../controllers/accountController.js';
import { PATH } from '../config/path.js';
import { registerValidationRules } from '~/validator/registerUserValidator.js';
import { validateRequest } from '~/middlewares/validateUserRegister.js';

const accountRouter = express.Router();

// Đăng ký người dùng
accountRouter.post(
  PATH.ACCOUNT.OUTLET.REGISTER,
  registerValidationRules, // Middleware để xác thực dữ liệu đầu vào
  validateRequest, // Middleware để kiểm tra kết quả xác thực
  registerUser // Hàm xử lý đăng ký người dùng
);
// Đăng nhập người dùng
accountRouter.post(PATH.ACCOUNT.OUTLET.LOGIN, loginUser);

// Đăng xuất người dùng
accountRouter.post(PATH.ACCOUNT.OUTLET.LOGOUT, logoutUser);
accountRouter.get(PATH.ACCOUNT.OUTLET.GITHUB.LOGIN, loginGithub);
accountRouter.get(PATH.ACCOUNT.OUTLET.GITHUB.CALLBACK, githubCallbackFunction, githubLoginSuccess);
accountRouter.get('/login', (req: Request, res: Response) => {
  res.render('authentication/login', {
    flash: req.flash()
  });
});

accountRouter.post('account/login', loginUser);

accountRouter.get('/register', (req: Request, res: Response) => {
  res.render('authentication/register', {
    flash: req.flash()
  });
});

accountRouter.post('account/register', registerUser);

// Route: Home page
export default accountRouter;
