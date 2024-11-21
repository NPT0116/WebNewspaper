import express from 'express';
import { PATH } from '~/config/path.js';
import reporterDashboardRouter from './reporter/reporterDashboardRouter.js';
const dashboardRouter = express.Router();

dashboardRouter.use(PATH.DASHBOARD.REPORTER.PATH, reporterDashboardRouter);

export default dashboardRouter;
