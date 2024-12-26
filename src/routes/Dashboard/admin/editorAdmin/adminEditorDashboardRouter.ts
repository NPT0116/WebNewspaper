import { Router } from 'express';
import { PATH } from '~/config/path.js';
import { adminCreateEditor, adminDeleteEditor, adminUpdateEditor, renderAdminEditorPage } from '~/controllers/Dashboard/Admin/adminEditors/adminEditorsDashboardController.js';

const editorAdminDashboardRouter = Router();

editorAdminDashboardRouter.get('/', renderAdminEditorPage);
editorAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.USERS.EDITORS.CREATE_EDITOR, adminCreateEditor);
editorAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.USERS.EDITORS.UPDATE_EDITOR, adminUpdateEditor);
// editorAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.USERS.EDITORS.DELETE_EDITOR, adminDeleteEditor);

export default editorAdminDashboardRouter;
const a = 12;
