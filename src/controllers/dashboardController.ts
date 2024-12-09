import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { getArticleByIdParams } from '~/interfaces/Article/articleInterface.js';
import { editorGetArticleById, getAllArticles } from '~/repo/Article/articleRepo.js';

export const getEditorReviewPage = async (req: Request<getArticleByIdParams>, res: Response) => {
  const { articleId } = req.params;
  const article = await editorGetArticleById(articleId, '');
  res.render('pages/DashboardPages/EditorReviewPage', { article });
};

export const getAdminDashboardPage = async (req: Request, res: Response) => {
  const articles = await getAllArticles();
  res.render('layouts/DashboardLayout/DashboardLayout', {
    body: '../../pages/DashboardPages/Admin/AdminArticlesPage',
    data: { articles, role: 'admin' }
  });
};

export const getAdminReadersPage = async (req: Request, res: Response) => {
  const articles = await getAllArticles();
  res.render('layouts/DashboardLayout/DashboardLayout', {
    body: '../../pages/DashboardPages/Admin/ReadersPage',
    data: { articles, role: 'admin' }
  });
};

export const getAdminEditorsPage = async (req: Request, res: Response) => {
  res.render('layouts/DashboardLayout/DashboardLayout', {
    body: '../../pages/DashboardPages/Admin/EditorsPage',
    data: { role: 'admin' }
  });
};

export const getAdminReportersPage = async (req: Request, res: Response) => {
  res.render('layouts/DashboardLayout/DashboardLayout', {
    body: '../../pages/DashboardPages/Admin/ReportersPage',
    data: { role: 'admin' }
  });
};
function getArticleByReporterId(authorId: Types.ObjectId) {
  throw new Error('Function not implemented.');
}
