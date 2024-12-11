import express from 'express';
import { PATH } from '~/config/path.js';
import { renderAdminSectionPage, renderAdminTagsPage } from '~/controllers/Dashboard/Admin/adminDashboardController.js';
import readerAdminDashboardRouter from './readerAdmin/readerAdminDashboardRouter.js';
import articleAdminDashboardRouter from './articlesAdmin/articlesAdminDashboardRouter.js';
import reporterAdminDashboardRouter from './reporterAdmin/reporterAdminDashboardRouter.js';
import editorAdminDashboardRouter from './editorAdmin/adminEditorDashboardRouter.js';
const adminDashboardRouter = express.Router();

// adminDashboardRouter.get(PATH.HOME, getAdminDashboardPage);
// adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.READERS, getAdminReadersPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.SECTION, renderAdminSectionPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.TAGS, renderAdminTagsPage);

adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.ARTICLES.PATH, articleAdminDashboardRouter);
adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.USERS.READERS.PATH, readerAdminDashboardRouter);
adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.USERS.REPORTERS.PATH, reporterAdminDashboardRouter);
adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.USERS.EDITORS.PATH, editorAdminDashboardRouter);
export default adminDashboardRouter;
