import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
import { IArticleCard } from '~/interfaces/Article/articleInterface.js';
import { Article } from '~/models/Article/articleSchema.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { AppError } from '~/utils/appError.js';
import { getSectionTree } from '~/repo/Section/index.js';
import { getProfile } from '../landingpageController.js';
import { Account } from '~/models/Account/accountSchema.js';

export const relatedArticleFunc = async (sectionSlug: string) => {
  try {
    const section = await Section.findOne({ slug: sectionSlug });
    const relatedArticle = await Article.find({ sectionId: section?._id })
      .populate<{ sectionId: ISection }>('sectionId', 'name slug')
      .populate<{ tags: ITag[] }>('tags', 'name slug')
      .populate<{ author: IAuthor }>('author', 'name')
      .limit(8)
      .exec();
    if (!relatedArticle) return null;
    const response: IArticleCard[] = relatedArticle.map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      sectionId: {
        name: article.sectionId.name,
        _id: article.sectionId._id,
        slug: article.sectionId.slug
      },
      tags: article.tags.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
        _id: tag._id
      })),
      author: {
        name: article.author.name,
        _id: article.author._id
      },
      images: article.images,
      isSubscribed: article.isSubscribed
    }));
    return response;
  } catch (e) {
    return null;
  }
};

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
  layout: 1 | 2 | 3;
  status: 'draft' | 'approved' | 'rejected' | 'published' | 'pending';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  sectionId: ISection;
  tags: ITag[];
  comments: IComment[];
  views: number;
  bannerTheme: string;
  isSubscribed: boolean;
}
export const renderArticleDetail = async (req: Request<IArticleDetailParams>, res: Response<IArtcileDetailLandingpageResponse>, next: NextFunction) => {
  try {
    const { sectionSlug, articleSlug } = req.params;
    const sections = await getSectionTree();

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
    let relatedArticle: IArticleCard[] | null = await relatedArticleFunc(sectionSlug);
    if (relatedArticle === null) {
      relatedArticle = [];
    }

    // res.json({
    //   ...article.toObject(),
    //   comments: commentWithNames,
    //   relatedArticle,
    //   sections
    // });

    // Sort according to date created
    commentWithNames.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0; // Ensure it's a number
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0; // Ensure it's a number
      return dateB - dateA;
    });
    res.render('layouts/PostDetailLayout/PostDetailLayout', {
      body: '../../pages/PostDetailPage/PostDetailPage',
      ...article.toObject(),
      comments: commentWithNames,
      relatedArticle,
      sections
    });
  } catch (e) {
    next(new AppError("can't get detail article", 500));
  }
};
export const renderArticleDetailInFlippingMode = async (req: Request<IArticleDetailParams>, res: Response<IArtcileDetailLandingpageResponse>, next: NextFunction) => {
  try {
    const { sectionSlug, articleSlug } = req.params;
    const sections = await getSectionTree();

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
    let relatedArticle: IArticleCard[] | null = await relatedArticleFunc(sectionSlug);
    if (relatedArticle === null) {
      relatedArticle = [];
    }

    // res.json({
    //   ...article.toObject()
    // });

    res.render('layouts/PostDetailLayout/PostDetailFlipping', {
      ...article.toObject()
    });
  } catch (e) {
    next(new AppError("can't get detail article", 500));
  }
};

export const verifySubscription = async (req: Request<IArticleDetailParams>, res: Response, next: NextFunction) => {
  const { articleSlug } = req.params;

  // Chuyển query thành boolean
  const article = await Article.findOne({ slug: articleSlug });

  if (!article) {
    next(new AppError('Article not found', 404));
    return;
  }
  if (article.isSubscribed === false) {
    next();
    return;
  }
  // Kiểm tra người dùng đã đăng ký hay chưa
  const user = await Account.findById(req.user?._id);

  if (!user || !user.isSubscriber) {
    // Trả về thông báo cần mua subscription (JSON cho AJAX hoặc HTML cho modal)
    res.status(403).json({
      success: false,
      message: 'This article is for subscribers only. Please purchase a subscription to access it.'
    });
    return;
  }

  if (user.subscriptionExpiresAt && user.subscriptionExpiresAt < new Date()) {
    user.isSubscriber = false;
    user.subscriptionExpiresAt = undefined;

    await user.save();
    res.status(403).json({
      success: false,
      message: 'Your subscription has expired. Please renew your subscription to access this article.'
    });
    return;
  }
  // Người dùng có quyền truy cập
  next();
  return;
};
