import express from 'express';
import { PATH } from '~/config/path.js';
import { EditorApprovalAritcle, EditorDeleteArticle, getEditorDashboardPage } from '~/controllers/Dashboard/Editor/editorDashboardController.js';
import { getEditorReviewPage } from '~/controllers/dashboardController.js';
const editorDashboardRouter = express.Router();

editorDashboardRouter.get(PATH.HOME, getEditorDashboardPage);
editorDashboardRouter.get(PATH.DASHBOARD.EDITOR.PREVIEW, getEditorReviewPage);

// http://localhost:3001/dashboard/editor/:articleId/approve
editorDashboardRouter.post(PATH.DASHBOARD.EDITOR.APPROVE, EditorApprovalAritcle);
editorDashboardRouter.post(PATH.DASHBOARD.EDITOR.DELETE, EditorDeleteArticle);

export default editorDashboardRouter;
