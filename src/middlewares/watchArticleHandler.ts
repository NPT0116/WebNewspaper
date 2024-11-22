import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Article } from '~/models/Article/articleSchema.js';
import { ReaderProfile } from '~/models/Profile/readerProfile.js';
import { AppError } from '~/utils/appError.js';

interface IArticleDetailParams {
  sectionSlug: string;
  articleSlug: string;
}

export const watchArticleHandler = async (req: Request<IArticleDetailParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { articleSlug } = req.params;

    const article = await Article.findOne({ slug: articleSlug });

    if (!article) {
      return next(new AppError('Article not found', 404));
    }

    const articleObjectId = article._id;

    if (!mongoose.Types.ObjectId.isValid(articleObjectId)) {
      return next(new AppError('Invalid article ID', 400));
    }

    const user = req.user;
    if (user && user.role === 'reader') {
      article.views = (article.views || 0) + 1;
      await article.save();

      const reader = await ReaderProfile.findOne({ accountId: user._id });

      if (reader) {
        const watchedArticleIndex = reader.watchedArticles.findIndex((watched) => watched.articleId.toString() === articleObjectId.toString());

        if (watchedArticleIndex !== -1) {
          reader.watchedArticles[watchedArticleIndex].viewedAt = new Date();
        } else {
          reader.watchedArticles.push({ articleId: articleObjectId, viewedAt: new Date() });
        }
        await reader.save();
      }
    }

    next();
  } catch (error) {
    next(new AppError('Internal server error', 500));
  }
};
