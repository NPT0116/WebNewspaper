import { Request, Response, NextFunction } from 'express';
import { IAuthor, ISection, ITag } from '~/interfaces/Article/articleInterface.js';
import { Article } from '~/models/Article/articleSchema.js';
import { EditorProfile } from '~/models/Profile/editorProfile.js';
import { AppError } from '~/utils/appError.js';

interface IArticleDetailPreviewParams {
  articleId: string;
}

export const getPreviewPage = async (req: Request<IArticleDetailPreviewParams>, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findById(articleId)
      .populate<{ author: IAuthor }>('author', 'name')
      .populate<{ sectionId: ISection }>('sectionId', 'name slug')
      .populate<{ tags: ITag[] }>('tags', 'name slug')
      .exec();

    if (!article) {
      next(new AppError('Error getting article', 500));
      return;
    }

    const isEditor = req.user?.profileType === 'EditorProfile';

    if (req.user?.profileType === 'EditorProfile') {
      const editor = await EditorProfile.findById(req.user?.profileId);
      if (!editor) {
        next(new AppError("Error getting editor of the article's section", 500));
        return;
      }
      if (editor.sectionId.toString() !== article.sectionId._id.toString()) {
        return res.status(403).render('pages/ForbiddenPage/forbiddenPage', { message: 'Forbidden' });
      }
    } else if (req.user?.profileType === 'ReporterProfile') {
      if (req.user?.profileId?.toString() !== article.author._id.toString()) {
        return res.status(403).render('pages/ForbiddenPage/forbiddenPage', { message: 'Forbidden' });
      }
    }

    res.render('layouts/DashboardLayout/PreviewLayout/PreviewLayout', {
      body: '../../../pages/DashboardPages/PreviewPage/PreviewPage',
      ...article.toObject(),
      isEditor
    });
    // res.json({ ...article.toObject() });
  } catch {
    next(new AppError('Error getting preview page', 500));
  }
};
