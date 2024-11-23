import express from 'express';
import { PATH } from '~/config/path.js';
import reporterDashboardRouter from './reporter/reporterDashboardRouter.js';
import editorDashboardRouter from './editor/editorDashboardRouter.js';
import { verifyRole } from '~/middlewares/verifyRole.js';
const dashboardRouter = express.Router();

dashboardRouter.use(PATH.DASHBOARD.REPORTER.PATH, verifyRole(['reporter']), reporterDashboardRouter);
dashboardRouter.use(PATH.DASHBOARD.EDITOR.PATH, verifyRole(['editor']), editorDashboardRouter);
export default dashboardRouter;
