import express from 'express';
import { PATH } from '~/config/path.js';
import { getDashboardPage } from '~/controllers/dashboardController.js';
const dashboardRouter = express.Router();

dashboardRouter.get(PATH.DASHBOARD.BASE, getDashboardPage);

export default dashboardRouter;
