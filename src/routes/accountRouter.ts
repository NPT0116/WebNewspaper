// src/routes/userRouter.ts
import express, { NextFunction, Response, Request } from 'express';

import { registerUser, loginUser, logoutUser, loginGithub, githubLoginSuccess, githubCallbackFunction } from '../controllers/accountController.js';
import { PATH } from '../config/path.js';
import { registerValidationRules } from '~/validator/registerUserValidator.js';
import { validateRequest } from '~/middlewares/validateUserRegister.js';
import flash from 'connect-flash';
import Account from '~/models/accountSchema.js';
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
