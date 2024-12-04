import express from 'express';
import { PATH } from '~/config/path.js';
import { getAdminDashboardPage, getAdminEditorsPage, getAdminReadersPage, getAdminReportersPage } from '~/controllers/dashboardController.js';
const adminDashboardRouter = express.Router();

adminDashboardRouter.get(PATH.HOME, getAdminDashboardPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.EDITORS, getAdminEditorsPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.READERS, getAdminReadersPage);
adminDashboardRouter.get(PATH.DASHBOARD.ADMIN.USERS.REPORTERS, getAdminReportersPage);

export default adminDashboardRouter;
