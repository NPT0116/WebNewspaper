import { Request, Response } from 'express';
import { getArticleByIdParams } from '~/interfaces/Article/articleInterface.js';
import { editorGetArticleById, getAllArticles } from '~/repo/Article/articleRepo.js';

export const getReporterDashboardPage = async (req: Request, res: Response) => {
  const articles = await getAllArticles();
  // res.json({ articles });
  res.render('layouts/DashboardLayout/DashboardLayout', {
    body: '../../pages/DashboardPages/ReporterArticlesPage',
    data: { articles, role: 'reporter' }
  });
};

export const getEditorDashboardPage = async (req: Request, res: Response) => {
  const articles = await getAllArticles();
  res.render('layouts/DashboardLayout/DashboardLayout', {
    body: '../../pages/DashboardPages/EditorArticlesPage',
    data: { articles, role: 'editor' }
  });
};

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
