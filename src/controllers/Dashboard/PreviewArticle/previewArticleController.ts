import { Request, Response, NextFunction } from 'express';
import { IAuthor, ISection, ITag } from '~/interfaces/Article/articleInterface.js';
import { Article } from '~/models/Article/articleSchema.js';
import { getSectionTree } from '~/repo/Section/index.js';
import { AppError } from '~/utils/appError.js';

interface IArticleDetailPreviewParams {
  articleId: string;
}

export const getPreviewPage = async (req: Request<IArticleDetailPreviewParams>, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    // const sections = await getSectionTree();

    const article = await Article.findById(articleId)
      .populate<{ author: IAuthor }>('author', 'name') // Populate author
      .populate<{ sectionId: ISection }>('sectionId', 'name slug') // Populate section
      .populate<{ tags: ITag[] }>('tags', 'name slug') // Populate tags
      .exec();

    if (!article) {
      next(new AppError('Error getting article', 500));
      return;
    }

    res.render('layouts/DashboardLayout/PreviewLayout/PreviewLayout', {
      body: '../../../pages/DashboardPages/PreviewPage/PreviewPage',
      ...article.toObject()
      //   sections
    });
    // res.json({ ...article.toObject() });
  } catch {
    next(new AppError('Error getting preview page', 500));
  }
};
