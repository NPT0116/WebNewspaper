import { UpdateArtifactResponse } from 'aws-sdk/clients/sagemaker.js';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { IArticle, ISection, ITag } from '~/interfaces/Article/articleInterface.js';
import { Account } from '~/models/Account/accountSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import { ReporterProfile } from '~/models/Profile/reporterProfile.js';
import { EditorProfile } from '~/models/Profile/editorProfile.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { deleteArticle, getArticleByReporterId } from '~/repo/Article/articleRepo.js';
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

  tags?: string;
  layout?: 1 | 2 | 3;
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
      author: authorId.profileId,
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
    tags: ITag[];
    layout: 1 | 2 | 3;
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
    layout: 1 | 2 | 3;
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

    console.log(req.body);

    // Update fields if provided
    article.title = title || article.title;
    article.description = description || article.description;
    article.content = content || article.content;
    article.sectionId = sectionId || article.sectionId;
    article.tags = tags ? tags.split(',').map((id) => new mongoose.Types.ObjectId(id)) : [];
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
      res.redirect('/dashboard/reporter');
      return;
    }

    // Kiểm tra trạng thái hiện tại
    if (article.status !== 'draft' && article.status !== 'rejected') {
      // return res.render(reporterDashboardPage.layout, { body: reporterDashboardPage.body, submitError, articles });
      res.redirect('/dashboard/reporter');
    }
    if (article.status === 'rejected') {
      const editorId = article.rejected.editorId;
      if (editorId) {
        // Find the editor profile
        const editorProfile = await EditorProfile.findById(editorId);
        if (editorProfile) {
          // Remove the article ID from the editor's list of edited articles
          editorProfile.editArticles = editorProfile.editArticles.filter((editedArticleId) => !editedArticleId.equals(article._id));
          // Save the changes to the editor profile
          await editorProfile.save();
        }
      } else if (article.rejected.adminId) {
        // Remove the article ID from the admin's list of rejected articles
        article.rejected.adminId = undefined;
      }
      article.rejected.editorId = undefined;
      article.rejected.rejectReason = '';
    }
    // Cập nhật trạng thái bài viết
    article.status = 'pending';
    article.updatedAt = new Date();

    // Lưu thay đổi
    await article.save();

    // Render lại trang với bài viết đã cập nhật
    // return res.render(reporterDashboardPage.layout, { body: reporterDashboardPage.body, submitError: null, article, articles });
    res.redirect('/dashboard/reporter');
  } catch (e) {
    // Xử lý lỗi không mong muốn
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

export const writeArticle = async (req: Request<writeArticleParams>, res: Response<writeArticleResponse>, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findById(articleId).populate('tags');
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
        tags: article.tags as unknown as ITag[],
        layout: article.layout,
        images: article.images,
        status: article.status
      }
    };
    res.render('pages/ReporterPages/ArticleEditPage', response);
    // res.json(response);
  } catch (e) {
    console.error(e);
    next(new AppError('Unable to get article', 500));
  }
};

export const getReporterDashboardPage = async (req: Request, res: Response) => {
  const accountId = req.user?._id;
  if (!accountId) {
    res.status(403).json({ message: 'No permission' });
    return;
  }
  const account = await Account.findById(accountId);
  const authorId = account?.profileId;

  if (!authorId) {
    res.status(404).json({ message: 'Author not found' });
    return;
  }
  const reporterProfile = await ReporterProfile.findById(authorId);
  const articles = await getArticleByReporterId(authorId);
  // res.json({ articles });
  res.render('layouts/DashboardLayout/DashboardLayout', {
    body: '../../pages/DashboardPages/Reporter/ReporterArticlesPage',
    data: { articles, role: 'reporter', profile: reporterProfile }
  });
};

interface IReporterDeleteArticle {
  articleId: mongoose.Types.ObjectId;
}
export const ReporterDeleteArticle = async (req: Request<IReporterDeleteArticle>, res: Response) => {
  try {
    const { articleId } = req.params;
    if (!articleId) {
      res.redirect('/dashboard/reporter');
    }
    deleteArticle(articleId);
    res.redirect('/dashboard/reporter');
  } catch (e) {
    console.error('Error deleting article:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
