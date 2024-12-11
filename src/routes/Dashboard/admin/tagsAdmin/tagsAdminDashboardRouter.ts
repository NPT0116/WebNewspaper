import { Router } from 'express';
import { PATH } from '~/config/path.js';
import { createNewTag, renderAdminTagsPage, updateTag } from '~/controllers/Dashboard/Admin/adminTags/adminTagDashboardController.js';

const tagsAdminDashboardRouter = Router();

tagsAdminDashboardRouter.get('/', renderAdminTagsPage);
tagsAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.TAGS.CREATE_TAG, createNewTag);
tagsAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.TAGS.UPDATE_TAG, updateTag);
export default tagsAdminDashboardRouter;
