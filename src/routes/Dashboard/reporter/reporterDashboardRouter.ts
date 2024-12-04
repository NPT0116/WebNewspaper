import express from 'express';
import { PATH } from '~/config/path.js';
import { createArticle, submitArticle, updateArticle, writeArticle } from '~/controllers/Dashboard/Reporter/reporterDashboardController.js';

import { getReporterDashboardPage } from '~/controllers/dashboardController.js';
const reporterDashboardRouter = express.Router();

// http://localhost:3001/dashboard/reporter/write-article/1
reporterDashboardRouter.get(PATH.DASHBOARD.REPORTER.WRITE_ARTICLE, writeArticle);
reporterDashboardRouter.get(PATH.DASHBOARD.REPORTER.CREATE_ARTICLE, createArticle);
reporterDashboardRouter.post(PATH.DASHBOARD.REPORTER.SAVE_ARTICLE, updateArticle);
reporterDashboardRouter.get(PATH.HOME, getReporterDashboardPage);
reporterDashboardRouter.get(PATH.DASHBOARD.REPORTER.SUBMIT_ARTICLE, submitArticle);
export default reporterDashboardRouter;
