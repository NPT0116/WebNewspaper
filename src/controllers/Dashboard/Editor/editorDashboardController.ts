// localhost:3001/dashboard/editor/:articleId/approval

import { profile } from 'console';
import { NextFunction, Request, Response } from 'express';
import mongoose, { mongo } from 'mongoose';
import { Account } from '~/models/Account/accountSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import { EditorProfile } from '~/models/Profile/editorProfile.js';
import { deleteArticle, getArticleByEditorId } from '~/repo/Article/articleRepo.js';
import { AppError } from '~/utils/appError.js';

interface IEditorApprovalParams {
  articleId: mongoose.Types.ObjectId;
}
interface IEditorApprovalBody {
  status: 'approved' | 'rejected';
  publishedAt?: Date;
  rejectReason?: string;
}
interface IProfileIdPopulate {
  _id: string;
  sectionId: mongoose.Types.ObjectId;
}
interface IErrorEditorApproveArticle {
  errorCode: number;
  errorMessage: string;
  details?: string;
}

export const EditorApprovalAritcle = async (req: Request<IEditorApprovalParams, {}, IEditorApprovalBody>, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    const { status, publishedAt, rejectReason } = req.body;
    const accountId = req.user?._id;

    const article = await Article.findById(articleId).populate('tags', 'name');
    if (!article) {
      const approvalError: IErrorEditorApproveArticle = {
        errorCode: 400,
        errorMessage: 'Article not found',
        details: `Can't find article with ID: ${articleId}`
      };
      return res.render('layouts/DashboardLayout/DashboardLayout', {
        body: '../../pages/DashboardPages/PreviewPage',
        approvalError,
        article: null // Không có bài viết
      });
    }

    // Kiểm tra tài khoản
    const account = await Account.findById(accountId).populate<{ profileId: IProfileIdPopulate }>('profileId', 'sectionId');
    const editorProfile = await EditorProfile.findById(account?.profileId);
    if (!account) {
      const approvalError: IErrorEditorApproveArticle = {
        errorCode: 400,
        errorMessage: 'Account not found',
        details: `Can't find account with ID: ${accountId}`
      };
      return res.render('layouts/DashboardLayout/DashboardLayout', {
        body: '../../pages/DashboardPages/PreviewPage',
        approvalError,
        article
      });
    }
    if (!editorProfile) {
      const approvalError: IErrorEditorApproveArticle = {
        errorCode: 400,
        errorMessage: 'editorProfile not found',
        details: `Can't find editorProfile with ID: ${accountId}`
      };
      return res.render('layouts/DashboardLayout/DashboardLayout', {
        body: '../../pages/DashboardPages/PreviewPage',
        approvalError,
        article
      });
    }
    // Kiểm tra quyền của editor
    if (account.profileId.sectionId.toString() !== article.sectionId.toString()) {
      const approvalError: IErrorEditorApproveArticle = {
        errorCode: 400,
        errorMessage: 'Permission denied',
        details: 'Editor does not belong to the same section as the article'
      };
      return res.render('layouts/DashboardLayout/DashboardLayout', {
        body: '../../pages/DashboardPages/PreviewPage',
        approvalError,
        article
      });
    }

    // Kiểm tra trạng thái bài viết
    if (article.status !== 'pending') {
      const approvalError: IErrorEditorApproveArticle = {
        errorCode: 400,
        errorMessage: 'Invalid article status',
        details: "Article must be in 'pending' state to be approved or rejected"
      };
      return res.render('layouts/DashboardLayout/DashboardLayout', {
        body: '../../pages/DashboardPages/PreviewPage',
        approvalError,
        article
      });
    }

    // Nếu bài viết được duyệt
    if (status === 'approved') {
      if (!publishedAt) {
        const approvalError: IErrorEditorApproveArticle = {
          errorCode: 400,
          errorMessage: 'Published date required',
          details: 'Approved articles must have a published date'
        };
        return res.render('layouts/DashboardLayout/DashboardLayout', {
          body: '../../pages/DashboardPages/PreviewPage',
          approvalError,
          article
        });
      }
      article.status = status;
      article.approved.publishedAt = publishedAt;
      article.approved.editorId = editorProfile._id;
    } else {
      article.status = 'rejected';
      if (!rejectReason) {
        const defaultRejectReason = 'No reason provided';
        article.rejected.rejectReason = defaultRejectReason;
      } else {
        article.rejected.rejectReason = rejectReason;
      }
      article.rejected.editorId = editorProfile._id;
    }

    editorProfile.editArticles.push(article._id);
    // Lưu thay đổi bài viết
    await article.save();
    await editorProfile.save();
    // Render trang preview với thông báo thành công
    return res.redirect('/dashboard/editor');
  } catch (e) {
    // Xử lý lỗi chung
    const approvalError: IErrorEditorApproveArticle = {
      errorCode: 500,
      errorMessage: 'Server error',
      details: 'An unexpected error occurred while approving/rejecting the article'
    };
    return res.render('layouts/DashboardLayout/DashboardLayout', {
      body: '../../pages/DashboardPages/PreviewPage',
      approvalError,
      article: null
    });
  }
};

export const getEditorDashboardPage = async (req: Request, res: Response) => {
  const accountId = req.user?._id;
  if (!accountId) {
    res.status(403).json({ message: 'No permission' });
    return;
  }
  const account = await Account.findById(accountId);
  const editorId = account?.profileId;
  if (!editorId) {
    res.status(404).json({ message: 'Author not found' });
    return;
  }
  const articles = await getArticleByEditorId(editorId);
  res.render('layouts/DashboardLayout/DashboardLayout', {
    body: '../../pages/DashboardPages/Editor/EditorArticlesPage',
    data: { articles, role: 'editor' }
  });
};

interface IEditorDeleteArticle {
  articleId: mongoose.Types.ObjectId;
}
export const EditorDeleteArticle = async (req: Request<IEditorDeleteArticle>, res: Response) => {
  try {
    const { articleId } = req.params;
    if (!articleId) {
      res.redirect('/dashboard/editor');
    }
    deleteArticle(articleId);
    res.redirect('/dashboard/editor');
  } catch (e) {
    console.error('Error deleting article:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
