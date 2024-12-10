import mongoose from 'mongoose';
import { Article } from '~/models/Article/articleSchema.js';
import { Request, Response } from 'express';
import { deleteArticle } from '~/repo/Article/articleRepo.js';
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
      res.redirect('/dashboard/admin/articles');
    }
    deleteArticle(articleId);
    res.redirect('/dashboard/admin/articles');
  } catch (e) {
    console.error('Error deleting article:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
// admin approve article từ pending -> approved

// admin chuyển trạng thái bài viết từ unsubscribe thành có subscribe