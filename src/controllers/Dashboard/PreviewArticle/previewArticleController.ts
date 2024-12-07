import { Request, Response, NextFunction } from 'express';
import { Article } from '~/models/Article/articleSchema.js';
import { getSectionTree } from '~/repo/Section/index.js';
import { AppError } from '~/utils/appError.js';

interface IArticleDetailPreviewParams {
  articleId: string;
}

export const getPreviewPage = async (req: Request<IArticleDetailPreviewParams>, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    const sections = await getSectionTree();

    const article = await Article.findById(articleId);

    if (!article) {
      next(new AppError('Error getting article', 500));
      return;
    }

    // res.json({ ...article.toObject() });
    res.render('layouts/DashboardLayout/PreviewLayout/PreviewLayout', {
      body: '../../../pages/DashboardPages/PreviewPage/PreviewPage',
      ...article.toObject(),
      sections
    });
  } catch {
    next(new AppError('Error getting preview page', 500));
  }
};
