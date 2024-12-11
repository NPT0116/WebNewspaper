import express from 'express';
import { PATH } from '~/config/path.js';
import { renderAdminArticlePage } from '~/controllers/Dashboard/Admin/adminArticles/adminArticlesDashboardController.js';
import { renderAdminEditorPage, renderAdminSectionPage, renderAdminTagsPage } from '~/controllers/Dashboard/Admin/adminDashboardController.js';
import { renderAdminReaderPage } from '~/controllers/Dashboard/Admin/adminReader/adminReaderDashboardController.js';
import readerAdminDashboardRouter from './readerAdmin/readerAdminDashboardRouter.js';
import articleAdminDashboardRouter from './articlesAdmin/articlesAdminDashboardRouter.js';
import reporterAdminDashboardRouter from './reporterAdmin/reporterAdminDashboardRouter.js';
const adminDashboardRouter = express.Router();

// adminDashboardRouter.get(PATH.HOME, getAdminDashboardPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.EDITORS, renderAdminEditorPage);
// adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.READERS, getAdminReadersPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.SECTION, renderAdminSectionPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.TAGS, renderAdminTagsPage);

adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.ARTICLES.PATH, articleAdminDashboardRouter);
adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.USERS.READERS.PATH, readerAdminDashboardRouter);
adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.USERS.REPORTERS.PATH, reporterAdminDashboardRouter);
export default adminDashboardRouter;
