import { Router } from 'express';
import { PATH } from '~/config/path.js';
import { createNewSection, renderAdminSectionsPage, updateSection } from '~/controllers/Dashboard/Admin/adminSection/adminSectionDashboardController.js';

const sectionsAdminDashboardRouter = Router();

sectionsAdminDashboardRouter.get('/', renderAdminSectionsPage);
sectionsAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.SECTION.CREATE_SECTION, createNewSection);
sectionsAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.SECTION.UPDATE_SECTION, updateSection);
sectionsAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.SECTION.DELETE_SECTION, updateSection);
export default sectionsAdminDashboardRouter;
