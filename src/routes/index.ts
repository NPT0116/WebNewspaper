import express from 'express';
import { PATH } from '~/config/path.js';
import accountRouter from './accountRouter.js';
import landingRouter from './landingRouter.js';
import postRouter from './postRouter.js';
import uploadRouter from './uploadRouter.js';
import commentRouterTest from './test Comment/detailPost.js';
import detailArticleRouter from './detailArticleRouter.js';

const router = express.Router();

router.use(PATH.ACCOUNT.BASE, accountRouter);
router.use(PATH.HOME, landingRouter);
router.use(PATH.POST.PATH, postRouter);
router.use(PATH.API.BASE, uploadRouter);
router.use(PATH.HOME, detailArticleRouter);
// test

router.use(PATH.HOME, commentRouterTest);

export default router;
