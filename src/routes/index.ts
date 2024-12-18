import express from 'express';
import { PATH } from '~/config/path.js';
import accountRouter from './authentication/accountRouter.js';
import landingRouter from './landingpage/landingRouter.js';

import detailArticleRouter from './landingpage/articleDetail/detailArticleRouter.js';
import uploadRouter from './uploadRouter.js';
import dashboardRouter from './Dashboard/dashboardRouter.js';
import sectionRouter from './landingpage/sectionRouter/sectionRouter.js';
import profileRouter from './landingpage/profile/profileRouter.js';
import searchPageRouter from './SearchPage/searchPageRouter.js';
import { verifyRole } from '~/middlewares/verifyRole.js';
import apiRouter from './api/apiRouter.js';
const router = express.Router();

router.use(PATH.HOME, accountRouter);

// landing page router
router.use(PATH.HOME, landingRouter);
router.use(PATH.HOME, detailArticleRouter);
router.use(PATH.HOME, sectionRouter);
router.use(PATH.HOME, profileRouter);
router.use(PATH.HOME, searchPageRouter);
router.use(PATH.HOME, apiRouter);
// All dashboard router here
router.use(PATH.DASHBOARD.PATH, verifyRole(['admin', 'reporter', 'editor']), dashboardRouter);

// upload image router for write article
router.use('/api', uploadRouter);
// test

router.use(dashboardRouter);

export default router;
