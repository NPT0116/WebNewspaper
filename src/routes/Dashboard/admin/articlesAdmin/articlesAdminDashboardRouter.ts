import { Router } from 'express';
import { PATH } from '~/config/path.js';
import { adminApprovalArticle, adminChangeSubscriptionArticle, adminDeleteArticle, renderAdminArticlePage } from '~/controllers/Dashboard/Admin/adminArticles/adminArticlesDashboardController.js';

const articleAdminDashboardRouter = Router();

articleAdminDashboardRouter.get('/', renderAdminArticlePage);
articleAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.ARTICLES.DELETE, adminDeleteArticle);
articleAdminDashboardRouter.post(PATH.DASHBOARD.ADMIN.ARTICLES.APPROVE, adminApprovalArticle);
articleAdminDashboardRouter.get(PATH.DASHBOARD.ADMIN.ARTICLES.SUBSCRIPTION, adminChangeSubscriptionArticle);

export default articleAdminDashboardRouter;
