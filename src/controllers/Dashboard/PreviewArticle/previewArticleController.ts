import { Request, Response, NextFunction } from 'express';
import { IAuthor, ISection, ITag } from '~/interfaces/Article/articleInterface.js';
import { Article } from '~/models/Article/articleSchema.js';
import { AdminProfile } from '~/models/Profile/adminProfile.js';
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

    let canApprove = false;
    let approvePerson = '';
    const profileType = req.user?.profileType;

    if (profileType === 'EditorProfile') {
      canApprove = true;
      approvePerson = 'editor';
      const editor = await EditorProfile.findById(req.user?.profileId);
      if (!editor) {
        next(new AppError("Error getting editor of the article's section", 500));
        return;
      }
      if (editor.sectionId.toString() !== article.sectionId._id.toString()) {
        return res.status(403).render('pages/ForbiddenPage/forbiddenPage', { message: 'Forbidden' });
      }
    } else if (profileType === 'ReporterProfile') {
      if (req.user?.profileId?.toString() !== article.author._id.toString()) {
        return res.status(403).render('pages/ForbiddenPage/forbiddenPage', { message: 'Forbidden' });
      }
    } else if (profileType === 'AdminProfile') {
      canApprove = true;
      approvePerson = 'admin';
      const editor = await AdminProfile.findById(req.user?.profileId);
      if (!editor) {
        next(new AppError('Error getting admin', 500));
        return;
      }
    }

    res.render('layouts/DashboardLayout/PreviewLayout/PreviewLayout', {
      body: '../../../pages/DashboardPages/PreviewPage/PreviewPage',
      ...article.toObject(),
      canApprove,
      approvePerson
    });
    // res.json({ ...article.toObject() });
  } catch {
    next(new AppError('Error getting preview page', 500));
  }
};
