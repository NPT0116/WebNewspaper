import { UpdateArtifactResponse } from 'aws-sdk/clients/sagemaker.js';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { IArticle } from '~/interfaces/Article/articleInterface.js';
import { IReaderProfile } from '~/interfaces/Profile/profileBaseInterface.js';
import { Account } from '~/models/Account/accountSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import { ReporterProfile } from '~/models/Profile/reporterProfile.js';
import { AppError } from '~/utils/appError.js';

// Request params and body for updating an article
interface UpdateArticleParams {
  articleId: string;
}

interface UpdateArticleBody {
  authorId: mongoose.Types.ObjectId;
  title?: string;
  description?: string;
  content?: string;
  sectionId?: mongoose.Types.ObjectId;
  tags?: mongoose.Types.ObjectId[];
  layout?: 'text-left' | 'text-right' | 'default';
  images?: string[];
  videoUrl?: string;
}

// Create Article
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = req.user?._id;
    // console.log(req.user);

    // Validate authorId
    if (!accountId) {
      return next(new AppError('Author ID is required ', 400));
    }
    const authorId = await Account.findById(accountId).populate('profileId', '_id');
    console.log(authorId);

    // Check if author exists
    if (!authorId) {
      return next(new AppError('Author not found in the database', 404));
    }

    // Create a new article
    const newArticle = new Article({
      title: '',
      description: '',
      content: '',
      author: authorId,
      status: 'draft',
      sectionId: null,
      tags: [],
      comments: []
    });

    const articleSaved = await newArticle.save();

    // Redirect to the write-article page with the created articleId
    res.redirect(`/dashboard/reporter/write-article/${articleSaved._id}`);
  } catch (e) {
    console.error(e);
    next(new AppError('Unable to create a new article', 500));
  }
};

interface UpdateArticleResponse {
  status: string;
  data: {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    content: string;
    author: mongoose.Types.ObjectId;
    sectionId: mongoose.Types.ObjectId | null;
    tags: mongoose.Types.ObjectId[];
    layout: 'text-left' | 'text-right' | 'default';
    images: string[];
    videoUrl?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}
// Update Article
export const updateArticle = async (req: Request<UpdateArticleParams, {}, UpdateArticleBody>, res: Response<UpdateArtifactResponse>, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    const { authorId, title, description, content, sectionId, tags, layout, images, videoUrl } = req.body;

    // Validate article ID
    const article = (await Article.findById(articleId)) as IArticle | null;
    if (!article) {
      return next(new AppError('Article not found in the database', 404));
    }

    // Update fields if provided
    article.title = title || article.title;
    article.description = description || article.description;
    article.content = content || article.content;
    article.sectionId = sectionId || article.sectionId;
    article.tags = tags || article.tags;
    article.layout = layout || article.layout;
    article.images = images || article.images;
    article.videoUrl = videoUrl || article.videoUrl;

    const updatedArticle = await article.save();

    res.redirect(`/dashboard/reporter/write-article/${updatedArticle._id}`);
  } catch (e) {
    console.error(e);
    next(new AppError('Unable to update the article', 500));
  }
};
