import { Router } from 'express';
import { PATH } from '~/config/path.js';
import { adminCreateReporter, renderAdmindReporterPage, updateReporter } from '~/controllers/Dashboard/Admin/adminReporters/adminReportersDashboardController.js';

const reporterAdminDashboardRouter = Router();

reporterAdminDashboardRouter.get('/', renderAdmindReporterPage);
reporterAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.USERS.REPORTERS.CREATE_REPORTER, adminCreateReporter);
reporterAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.USERS.REPORTERS.UPDATE_REPORTER, updateReporter);
export default reporterAdminDashboardRouter;
