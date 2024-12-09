import express from 'express';
import { PATH } from '~/config/path.js';
import {
  renderAdminArticlePage,
  renderAdmindReporterPage,
  renderAdminEditorPage,
  renderAdminReaderPage,
  renderAdminSectionPage,
  renderAdminTagsPage
} from '~/controllers/Dashboard/Admin/adminDashboardController.js';
import { getAdminDashboardPage, getAdminEditorsPage, getAdminReadersPage, getAdminReportersPage } from '~/controllers/dashboardController.js';
const adminDashboardRouter = express.Router();

// adminDashboardRouter.get(PATH.HOME, getAdminDashboardPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.EDITORS, renderAdminEditorPage);
// adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.READERS, getAdminReadersPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.REPORTERS, renderAdmindReporterPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.ARTICLES, renderAdminArticlePage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.SECTION, renderAdminSectionPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.TAGS, renderAdminTagsPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.READERS, renderAdminReaderPage);

export default adminDashboardRouter;
