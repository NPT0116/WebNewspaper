import { Request, Response } from 'express';
import { getAllArticles } from '~/repo/Article/articleRepo.js';

export const getReporterDashboardPage = async (req: Request, res: Response) => {
  const articles = await getAllArticles();
  res.render('layouts/DashboardLayout/DashboardLayout', {
    body: '../../pages/DashboardPages/DashboardPage',
    data: { articles }
  });
};
