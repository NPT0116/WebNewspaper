import express from 'express';
import { PATH } from '~/config/path.js';
import { getEditorDashboardPage, getEditorReviewPage } from '~/controllers/dashboardController.js';
const editorDashboardRouter = express.Router();

editorDashboardRouter.get(PATH.HOME, getEditorDashboardPage);
editorDashboardRouter.get(PATH.DASHBOARD.EDITOR.REVIEW, getEditorReviewPage);

export default editorDashboardRouter;
