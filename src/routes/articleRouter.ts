// src/routes/userRouter.ts
import express, { NextFunction, Response, Request } from 'express';

import { registerUser, loginUser, logoutUser, loginGithub, githubLoginSuccess, githubCallbackFunction } from '../controllers/accountController.js';
import { PATH } from '../config/path.js';
import { registerValidationRules } from '~/validator/registerUserValidator.js';
import { validateRequest } from '~/middlewares/validateUserRegister.js';
const accountRouter = express.Router();
