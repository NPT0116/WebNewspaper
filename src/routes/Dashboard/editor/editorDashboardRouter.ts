import express from 'express';
import { PATH } from '~/config/path.js';
import { EditorApprovalAritcle } from '~/controllers/Dashboard/Editor/editorDashboardController.js';
import { createArticle, updateArticle } from '~/controllers/Dashboard/Reporter/reporterDashboardController.js';
import { getReporterDashboardPage } from '~/controllers/dashboardController.js';
const editorDashboardRouter = express.Router();

// http://localhost:3001/dashboard/editor/:articleId/approve
editorDashboardRouter.post(PATH.DASHBOARD.EDITOR.APPROVE, EditorApprovalAritcle);

export default editorDashboardRouter;
