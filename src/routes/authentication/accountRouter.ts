// src/routes/userRouter.ts
import express, { NextFunction, Response, Request } from 'express';

import { registerUser, loginUser, logoutUser, loginGithub, githubLoginSuccess, githubCallbackFunction } from '../../controllers/authentication/accountController.js';
import { PATH } from '../../config/path.js';
import { registerValidationRules } from '~/validator/registerUserValidator.js';
import { validateRequest } from '~/middlewares/validateUserRegister.js';
const accountRouter = express.Router();

accountRouter.post(PATH.AUTHENTICATION.REGISTER, registerValidationRules, validateRequest, registerUser).get(PATH.AUTHENTICATION.REGISTER, (req: Request, res: Response) => {
  res.render('authentication/register', {
    flash: req.flash()
  });
});
accountRouter.post(PATH.AUTHENTICATION.LOGIN, loginUser).get(PATH.AUTHENTICATION.LOGIN, (req: Request, res: Response) => {
  res.render('authentication/login', {
    flash: req.flash()
  });
});

accountRouter.post(PATH.AUTHENTICATION.LOGOUT, logoutUser);
accountRouter.get(PATH.AUTHENTICATION.GITHUB, loginGithub);
accountRouter.get(PATH.AUTHENTICATION.GITHUB_CALLBACK, githubCallbackFunction, githubLoginSuccess);
accountRouter.get(PATH.AUTHENTICATION.LOGOUT, logoutUser);
// Route: Home page
export default accountRouter;
