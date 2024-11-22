import express from 'express';
import { PATH } from '~/config/path.js';
import accountRouter from './authentication/accountRouter.js';
import landingRouter from './landingpage/landingRouter.js';
import commentRouterTest from './test Comment/detailPost.js';
import detailArticleRouter from './landingpage/articleDetail/detailArticleRouter.js';
import uploadRouter from './uploadRouter.js';
import dashboardRouter from './Dashboard/dashboardRouter.js';
import searchPageRouter from './SearchPage/searchPageRouter.js';
const router = express.Router();

router.use(PATH.HOME, accountRouter);

// landing page router
router.use(PATH.HOME, landingRouter);
router.use(PATH.HOME, detailArticleRouter);
router.use(PATH.HOME, searchPageRouter);
// All dashboard router here
router.use(PATH.DASHBOARD.PATH, dashboardRouter);

// upload image router for write article
router.use('/api', uploadRouter);
// test
router.use(PATH.HOME, commentRouterTest);

router.use(dashboardRouter);
export default router;
