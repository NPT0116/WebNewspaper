import express from 'express';
import { PATH } from '~/config/path.js';
import accountRouter from './accountRouter.js';
import landingRouter from './landingRouter.js';

const router = express.Router();

router.use(PATH.ACCOUNT.BASE, accountRouter);

router.use(PATH.HOME, landingRouter);
export default router;
