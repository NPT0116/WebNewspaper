import { UpdateArtifactResponse } from 'aws-sdk/clients/sagemaker.js';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { IArticle, ISection } from '~/interfaces/Article/articleInterface.js';
import { Account } from '~/models/Account/accountSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { AppError } from '~/utils/appError.js';
import { reporterDashboardPage } from '~/utils/pages/page.js';

// Request params and body for updating an article
interface UpdateArticleParams {
  articleId: string;
}

interface UpdateArticleBody {
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

interface writeArticleParams {
  articleId: mongoose.Types.ObjectId;
}
interface writeArticleResponse {
  status: string;
  data: {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    content: string;
    author: mongoose.Types.ObjectId;
    sectionId: mongoose.Types.ObjectId | null;
    sections: ISection[] | null;
    tags: mongoose.Types.ObjectId[];
    layout: 'text-left' | 'text-right' | 'default';
    images: string[];
    status: string;
  };
}

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
    const { title, description, content, sectionId, tags, layout, images, videoUrl } = req.body;

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

interface submitArticleParams {
  articleId: string;
}
interface ISubmitError {
  errorCode: number;
  errorMessage: string;
  details?: string;
}

export const submitArticle = async (req: Request<submitArticleParams>, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;

    // Tìm bài viết cần chuyển trạng thái
    const article = await Article.findById(articleId);

    // Nếu bài viết không tồn tại
    if (!article) {
      const submitError: ISubmitError = {
        errorCode: 404,
        errorMessage: 'Article not found',
        details: `No article found with ID: ${articleId}`
      };
      return res.render(reporterDashboardPage.layout, { body: reporterDashboardPage.body, submitError, article: null });
    }

    // Kiểm tra trạng thái hiện tại
    if (article.status !== 'draft') {
      const submitError: ISubmitError = {
        errorCode: 400,
        errorMessage: 'Invalid article status',
        details: 'Only articles with "draft" status can be submitted for approval'
      };
      return res.render(reporterDashboardPage.layout, { body: reporterDashboardPage.body, submitError, article });
    }

    // Cập nhật trạng thái bài viết
    article.status = 'pending';
    article.updatedAt = new Date();

    // Lưu thay đổi
    await article.save();

    // Render lại trang với bài viết đã cập nhật
    return res.render(reporterDashboardPage.layout, { body: reporterDashboardPage.body, submitError: null, article });
  } catch (e) {
    // Xử lý lỗi không mong muốn
    const submitError: ISubmitError = {
      errorCode: 500,
      errorMessage: 'Server error',
      details: 'An unexpected error occurred while submitting the article'
    };
    return res.render(reporterDashboardPage.layout, { body: reporterDashboardPage.body, submitError, article: null });
  }
};

export const writeArticle = async (req: Request<writeArticleParams>, res: Response<writeArticleResponse>, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findById(articleId);
    if (!article) {
      res.redirect('/dashboard/reporter');
      return;
    }
    const sections = await Section.find({});
    const response: writeArticleResponse = {
      status: 'success',
      data: {
        _id: article._id,
        title: article.title,
        description: article.description,
        content: article.content,
        author: article.author,
        sectionId: article.sectionId,
        sections,
        tags: article.tags,
        layout: article.layout,
        images: article.images,
        status: article.status
      }
    };
    res.render('pages/ReporterPages/ArticleEditPage', response);
  } catch (e) {
    console.error(e);
    next(new AppError('Unable to get article', 500));
  }
};
