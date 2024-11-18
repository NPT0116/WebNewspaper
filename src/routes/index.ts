import express from 'express';
import { PATH } from '~/config/path.js';
import accountRouter from './accountRouter.js';
import landingRouter from './landingRouter.js';
import postRouter from './postRouter.js';

const router = express.Router();

router.use(PATH.ACCOUNT.BASE, accountRouter);
router.use(PATH.HOME, landingRouter);
router.use(PATH.POST.PATH, postRouter);
export default router;
