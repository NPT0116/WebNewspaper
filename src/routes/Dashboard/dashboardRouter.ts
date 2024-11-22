import express from 'express';
import { PATH } from '~/config/path.js';
import reporterDashboardRouter from './reporter/reporterDashboardRouter.js';
import editorDashboardRouter from './editor/editorDashboardRouter.js';
const dashboardRouter = express.Router();

dashboardRouter.use(PATH.DASHBOARD.REPORTER.PATH, reporterDashboardRouter);
dashboardRouter.use(PATH.DASHBOARD.EDITOR.PATH, editorDashboardRouter);
export default dashboardRouter;
