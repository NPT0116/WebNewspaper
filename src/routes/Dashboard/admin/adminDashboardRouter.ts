import express from 'express';
import { PATH } from '~/config/path.js';
import { renderAdminArticlePage } from '~/controllers/Dashboard/Admin/adminArticles/adminArticlesDashboardController.js';
import { renderAdmindReporterPage, renderAdminEditorPage, renderAdminSectionPage, renderAdminTagsPage } from '~/controllers/Dashboard/Admin/adminDashboardController.js';
import { renderAdminReaderPage } from '~/controllers/Dashboard/Admin/adminReader/adminReaderDashboardController.js';
import readerAdminDashboardRouter from './readerAdmin/readerAdminDashboardRouter.js';
const adminDashboardRouter = express.Router();

// adminDashboardRouter.get(PATH.HOME, getAdminDashboardPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.EDITORS, renderAdminEditorPage);
// adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.READERS, getAdminReadersPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.REPORTERS, renderAdmindReporterPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.ARTICLES, renderAdminArticlePage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.SECTION, renderAdminSectionPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.TAGS, renderAdminTagsPage);

adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.USERS.READERS.PATH, readerAdminDashboardRouter);

export default adminDashboardRouter;
