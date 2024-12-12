import { Router } from 'express';
import { PATH } from '~/config/path.js';
import { createNewSection, renderAdminSectionsPage, updateSection } from '~/controllers/Dashboard/Admin/adminSection/adminSectionDashboardController.js';

const sectionsAdminDashboardRouter = Router();

sectionsAdminDashboardRouter.get('/', renderAdminSectionsPage);
sectionsAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.TAGS.CREATE_TAG, createNewSection);
sectionsAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.TAGS.UPDATE_TAG, updateSection);
export default sectionsAdminDashboardRouter;
