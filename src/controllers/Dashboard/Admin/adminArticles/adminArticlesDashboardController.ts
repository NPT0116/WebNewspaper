import mongoose from 'mongoose';
import { Article } from '~/models/Article/articleSchema.js';
import { Account } from '~/models/Account/accountSchema.js';
import { NextFunction, Request, Response } from 'express';
import { changeSubscriptionArticle, deleteArticle } from '~/repo/Article/articleRepo.js';
import { AdminProfile } from '~/models/Profile/adminProfile.js';
interface IAuthor {
  _id: mongoose.Types.ObjectId;
  name: string;
}

interface IDashboardArticle {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  author: IAuthor;
  images: string[];
  videoUrl?: string;
  publishedAt?: Date;
  layout: 1 | 2 | 3;
  status: 'draft' | 'approved' | 'rejected' | 'published' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  sectionId: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  views: number;
  isSubscribed: boolean;
  approved: {
    editorId?: mongoose.Types.ObjectId;
    publishedAt?: Date;
  };
  rejected: {
    editorId?: mongoose.Types.ObjectId;
    rejectReason?: string;
  };
}

export const renderAdminArticlePage = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find({})
      .populate({
        path: 'rejected.editorId',
        select: 'name',
        model: 'EditorProfile'
      })
      .populate({
        path: 'approved.editorId',
        select: 'name',
        model: 'EditorProfile'
      })
      .populate({
        path: 'sectionId',
        select: 'name'
      })
      .populate<{ author: IAuthor }>('author', 'name');

    const data: IDashboardArticle[] = articles.map((article) => {
      return {
        _id: article._id,
        title: article.title,
        description: article.description,
        author: article.author as IAuthor,
        images: article.images,
        videoUrl: article.videoUrl,
        publishedAt: article.publishedAt,
        layout: article.layout,
        status: article.status,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        sectionId: article.sectionId,
        tags: article.tags,
        views: article.views ?? 0,
        isSubscribed: article.isSubscribed,
        approved: {
          editorId: article.approved?.editorId,
          publishedAt: article.approved?.publishedAt
        },
        rejected: {
          editorId: article.rejected?.editorId,
          rejectReason: article.rejected?.rejectReason
        }
      };
    });

    res.render('layouts/DashboardLayout/DashboardLayout', {
      body: '../../pages/DashboardPages/Admin/AdminArticlesPage',
      data: { articles: data, role: 'admin' }
    });
    // res.json({ data });
  } catch (e) {
    console.error('Error retrieving reporter profiles:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

interface IAdminDeleteArticle {
  articleId: mongoose.Types.ObjectId;
}
export const adminDeleteArticle = async (req: Request<IAdminDeleteArticle>, res: Response) => {
  try {
    const { articleId } = req.params;
    if (!articleId) {
      res.redirect('/dashboard/admin');
    }
    deleteArticle(articleId);
    res.redirect('/dashboard/admin');
  } catch (e) {
    console.error('Error deleting article:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
// admin approve article từ pending -> approved
interface IAdminApprovalParams {
  articleId: mongoose.Types.ObjectId;
}
interface IAdminApprovalBody {
  status: 'approved' | 'rejected';
  publishedAt?: Date;
  rejectReason?: string;
}
interface IErrorAdminApproveArticle {
  errorCode: number;
  errorMessage: string;
  details?: string;
}
export const adminApprovalArticle = async (req: Request<IAdminApprovalParams, {}, IAdminApprovalBody>, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    const { status, publishedAt, rejectReason } = req.body;
    const accountId = req.user?._id;

    const article = await Article.findById(articleId).populate('tags', 'name');
    if (!article) {
      const approvalError: IErrorAdminApproveArticle = {
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
    const account = await Account.findById(accountId);
    const adminProfile = await AdminProfile.findById(account?.profileId);
    if (!account) {
      const approvalError: IErrorAdminApproveArticle = {
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
    if (!adminProfile) {
      const approvalError: IErrorAdminApproveArticle = {
        errorCode: 400,
        errorMessage: 'adminProfile not found',
        details: `Can't find adminProfile with ID: ${accountId}`
      };
      return res.render('layouts/DashboardLayout/DashboardLayout', {
        body: '../../pages/DashboardPages/PreviewPage',
        approvalError,
        article
      });
    }

    // Kiểm tra trạng thái bài viết
    if (article.status !== 'pending') {
      const approvalError: IErrorAdminApproveArticle = {
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
        const approvalError: IErrorAdminApproveArticle = {
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
      article.approved.adminId = adminProfile._id;
    } else {
      article.status = 'rejected';
      if (!rejectReason) {
        const defaultRejectReason = 'No reason provided';
        article.rejected.rejectReason = defaultRejectReason;
      } else {
        article.rejected.rejectReason = rejectReason;
      }
      article.rejected.adminId = adminProfile._id;
    }

    // Lưu thay đổi bài viết
    await article.save();
    // Render trang preview với thông báo thành công
    return res.redirect('/dashboard/admin');
  } catch (e) {
    // Xử lý lỗi chung
    const approvalError: IErrorAdminApproveArticle = {
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

// admin chuyển trạng thái bài viết từ unsubscribe thành có subscribe
interface IAdminChangeSubscriptionArticle {
  articleId: mongoose.Types.ObjectId;
}
export const adminChangeSubscriptionArticle = async (req: Request<IAdminChangeSubscriptionArticle>, res: Response) => {
  try {
    const { articleId } = req.params;
    if (!articleId) {
      res.redirect('/dashboard/admin');
    }
    changeSubscriptionArticle(articleId);
    res.redirect('/dashboard/admin');
  } catch (e) {
    console.error('Error changing subscription of article:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
