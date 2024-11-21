import express from 'express';
import { PATH } from '~/config/path.js';
import { createArticle, updateArticle } from '~/controllers/Dashboard/Reporter/reporterDashboardController.js';
const reporterDashboardRouter = express.Router();

// http://localhost:3001/dashboard/reporter/write-article/1
reporterDashboardRouter.get(PATH.DASHBOARD.REPORTER.WRITE_ARTICLE, (req, res) => {
  res.render('pages/EditorPage/Editor');
});
reporterDashboardRouter.get(PATH.DASHBOARD.REPORTER.CREATE_ARTICLE, createArticle);
reporterDashboardRouter.get(PATH.DASHBOARD.REPORTER.SAVE_ARTICLE, updateArticle);
export default reporterDashboardRouter;
