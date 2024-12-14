import { Request, Response, NextFunction } from 'express';
import { format } from 'path';
import { IAuthor, ISection, ITag } from '~/interfaces/Article/articleInterface.js';
import { Article } from '~/models/Article/articleSchema.js';
import { AdminProfile } from '~/models/Profile/adminProfile.js';
import { EditorProfile } from '~/models/Profile/editorProfile.js';
import { AppError } from '~/utils/appError.js';

function formatDate(date: Date): string {
  const padZero = (num: number): string => num.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1); // Months are zero-based
  const day = padZero(date.getDate());

  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());

  const timezoneOffset = date.getTimezoneOffset(); // In minutes
  const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
  const sign = timezoneOffset > 0 ? '-' : '+';

  const timezone = `${sign}${offsetHours}`;

  return `${month}/${day}/${year} ${hours}:${minutes} GMT${timezone}`;
}

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

    let publishedAtDate: string = '';
    if (article.status === 'approved' || article.status === 'published') {
      const date: Date = article.approved?.publishedAt || new Date();
      publishedAtDate = formatDate(date);
    }
    let rejectReason: string = '';
    let rejectPerson: string = '';
    if (article.status === 'rejected') {
      rejectReason = article.rejected?.rejectReason || '';
      const rejectPersonId = article.rejected?.editorId || article.rejected?.adminId || '';
      const editorReject = !article.rejected?.adminId;
      if (editorReject) {
        const editor = await EditorProfile.findById(rejectPersonId);
        rejectPerson = editor?.name || '';
      } else {
        const admin = await AdminProfile.findById(rejectPersonId);
        rejectPerson = admin?.name || '';
      }
    }

    const viewCount = article.views || 0;

    res.render('layouts/DashboardLayout/PreviewLayout/PreviewLayout', {
      body: '../../../pages/DashboardPages/PreviewPage/PreviewPage',
      ...article.toObject(),
      canApprove,
      approvePerson,
      publishedAtDate,
      rejectReason,
      rejectPerson,
      viewCount
    });
    // res.json({ ...article.toObject() });
  } catch {
    next(new AppError('Error getting preview page', 500));
  }
};
