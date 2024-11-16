import express from 'express';
import { PATH } from '~/config/path.js';
import accountRouter from './accountRouter.js';

const router = express.Router();

router.use(PATH.ACCOUNT.PATH, accountRouter);

export default router;
