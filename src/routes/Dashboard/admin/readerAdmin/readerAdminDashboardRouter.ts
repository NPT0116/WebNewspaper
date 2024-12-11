import { Router } from 'express';
import { PATH } from '~/config/path.js';
import { renderAdminReaderPage, upgradeReaderToSubscriber } from '~/controllers/Dashboard/Admin/adminReader/adminReaderDashboardController.js';

const readerAdminDashboardRouter = Router();

readerAdminDashboardRouter.get('/', renderAdminReaderPage);
readerAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.USERS.READERS.UPGRADE_READER, upgradeReaderToSubscriber);

export default readerAdminDashboardRouter;
