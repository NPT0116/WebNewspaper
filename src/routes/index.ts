import express from 'express';
import { PATH } from '~/config/path.js';
import accountRouter from './authentication/accountRouter.js';
import landingRouter from './landingpage/landingRouter.js';
import commentRouterTest from './test Comment/detailPost.js';
import detailArticleRouter from './landingpage/articleDetail/detailArticleRouter.js';

const router = express.Router();

router.use(PATH.HOME, accountRouter);
router.use(PATH.HOME, landingRouter);
// router.use(PATH.POST.PATH, postRouter);
// router.use(PATH.API.BASE, uploadRouter);
router.use(PATH.HOME, detailArticleRouter);
// test

router.use(PATH.HOME, commentRouterTest);

export default router;
