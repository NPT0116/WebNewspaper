import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
import { Article } from '~/models/Article/articleSchema.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { AppError } from '~/utils/appError.js';

interface IArticleDetailParams {
  sectionSlug: string;
  articleSlug: string;
}
export interface IAuthor {
  _id: mongoose.Types.ObjectId;
  name: string;
}

export interface ITag {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
}

export interface ISection {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
}

export interface IComment extends mongoose.Document {
  article: mongoose.Types.ObjectId; // Refers to the Article being commented on
  account: mongoose.Types.ObjectId | IAccount; // Populate sẽ trả về đối tượng Account
  content: string; // Nội dung bình luận
  createdAt: Date;
}
interface IArtcileDetailLandingpageResponse {
  _id: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: IAuthor;
  editor: mongoose.Types.ObjectId;
  images: string[];
  videoUrl?: string;
  layout: 'text-left' | 'text-right' | 'default';
  status: 'draft' | 'approved' | 'rejected' | 'published' | 'pending';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  sectionId: ISection;
  tags: ITag[];
  comments: IComment[];
  views: number;
  bannerTheme: string;
}
export const renderArticleDetail = async (req: Request<IArticleDetailParams>, res: Response<IArtcileDetailLandingpageResponse>, next: NextFunction) => {
  try {
    const { sectionSlug, articleSlug } = req.params;
    const existingArticle = await Article.findOne({ slug: articleSlug });
    const existingSection = await Section.findOne({ slug: sectionSlug });
    if (sectionSlug === 'api') {
      next();
      return;
    }
    if (!existingArticle || !existingSection) {
      next();
      return;
    }
    const article = await Article.findOne({ slug: articleSlug })
      .populate<{ sectionId: ISection }>('sectionId', 'name slug') // Populate section
      .populate<{ tags: ITag[] }>('tags', 'name slug') // Populate tags
      .populate<{ author: IAuthor }>('author', 'name') // Populate author
      .populate<{ comments: IComment[] }>('comments', 'content createdAt account') // Populate comments
      .exec();
    if (!article) {
      next(new AppError('Cant find the articleSlug', 500));
      return;
    }
    if (article.sectionId.slug !== sectionSlug) {
      next(new AppError('different in section slug between section and article', 500));
      next();
    }
    const commentWithNames = await Promise.all(
      article.comments.map(async (comment) => {
        const account = await mongoose.model('Account').findById(comment.account).populate('profileId', 'name');

        return {
          content: comment.content,
          createdAt: comment.createdAt,
          commenterName: account.profileId.name || 'Anonymous'
        };
      })
    );
    console.log({
      ...article.toObject(),
      comments: commentWithNames
    });

    res.render('pages/PostDetailPage/PostDetailPage', {
      ...article.toObject(),
      comments: commentWithNames
    });
  } catch (e) {
    next(new AppError("can't get detail article", 500));
  }
};
