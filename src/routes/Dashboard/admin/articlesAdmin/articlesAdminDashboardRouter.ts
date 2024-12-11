import { Router } from 'express';
import { PATH } from '~/config/path.js';
import { adminDeleteArticle, renderAdminArticlePage } from '~/controllers/Dashboard/Admin/adminArticles/adminArticlesDashboardController.js';

const articleAdminDashboardRouter = Router();

articleAdminDashboardRouter.get('/', renderAdminArticlePage);
articleAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.ARTICLES.DELETE, adminDeleteArticle);
