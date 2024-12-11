import express from 'express';
import { PATH } from '~/config/path.js';
import readerAdminDashboardRouter from './readerAdmin/readerAdminDashboardRouter.js';
import articleAdminDashboardRouter from './articlesAdmin/articlesAdminDashboardRouter.js';
import reporterAdminDashboardRouter from './reporterAdmin/reporterAdminDashboardRouter.js';
import editorAdminDashboardRouter from './editorAdmin/adminEditorDashboardRouter.js';
import tagsAdminDashboardRouter from './tagsAdmin/tagsAdminDashboardRouter.js';
import sectionsAdminDashboardRouter from './sectionAdmin/sectionsAdminDashboardRouter.js';
const adminDashboardRouter = express.Router();

adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.ARTICLES.PATH, articleAdminDashboardRouter);
adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.USERS.READERS.PATH, readerAdminDashboardRouter);
adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.USERS.REPORTERS.PATH, reporterAdminDashboardRouter);
adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.USERS.EDITORS.PATH, editorAdminDashboardRouter);
adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.TAGS.PATH, tagsAdminDashboardRouter);
adminDashboardRouter.use(PATH.DASHBOARD.ADMIN.SECTION.PATH, sectionsAdminDashboardRouter);
export default adminDashboardRouter;
