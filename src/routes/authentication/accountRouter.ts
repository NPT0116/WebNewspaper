// src/routes/userRouter.ts
import express, { NextFunction, Response, Request } from 'express';

import {
  registerUser,
  loginUser,
  logoutUser,
  loginGithub,
  githubLoginSuccess,
  githubCallbackFunction,
  forgotPassword,
  resetPassword,
  verifyOtp
} from '../../controllers/authentication/accountController.js';
import { PATH } from '../../config/path.js';
import { registerValidationRules } from '~/validator/registerUserValidator.js';
import { validateRequest } from '~/middlewares/validateUserRegister.js';
import { redirectIfLogin } from '~/utils/redirectIfLogin.js';

const accountRouter = express.Router();

accountRouter.post(PATH.AUTHENTICATION.REGISTER, registerValidationRules, registerUser).get(PATH.AUTHENTICATION.REGISTER, (req: Request, res: Response) => {
  const hostname = req.hostname;
  res.render('authentication/register', {
    hostname,
    flash: req.flash()
  });
});
accountRouter.post(PATH.AUTHENTICATION.LOGIN, loginUser).get(PATH.AUTHENTICATION.LOGIN, redirectIfLogin, (req: Request, res: Response) => {
  res.render('authentication/login', {
    flash: req.flash()
  });
});

//Nhập email khi quên mật khẩu
accountRouter.get(PATH.AUTHENTICATION.FORGOT_PASSWORD, (req: Request, res: Response) => {
  res.render('authentication/forgotPassword', { error: req.flash('error') || '' });
});

//Post email
accountRouter.post(PATH.AUTHENTICATION.SEND_OTP, forgotPassword);

//Nhập OTP
accountRouter.get('/login/forgot-password/verify', (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (!email) {
    res.status(400).send('Email is required');
    return;
  }

  res.render('authentication/forgotPasswordVerify', { email: email, error: req.flash('error') || '' });
});

//POST OTP
accountRouter.post('/login/forgot-password/verify', verifyOtp);

//Nhập reset password
accountRouter.get('/login/forgot-password/reset', (req: Request, res: Response) => {
  const email = req.query.email as string; // Lấy email từ query string
  if (!email) {
    res.status(400).send('Email is required');
    return;
  }

  res.render('authentication/forgotPasswordReset', { email: email, error: req.flash('error') || '' });
});

// Route POST để nhận mật khẩu mới và cập nhật vào tài khoản
accountRouter.post('/login/forgot-password/reset', resetPassword);

accountRouter.post(PATH.AUTHENTICATION.LOGOUT, logoutUser);
accountRouter.get(PATH.AUTHENTICATION.GITHUB, loginGithub);
accountRouter.get(PATH.AUTHENTICATION.GITHUB_CALLBACK, githubCallbackFunction, githubLoginSuccess);
accountRouter.get(PATH.AUTHENTICATION.LOGOUT, logoutUser);
// Route: Home page
export default accountRouter;
