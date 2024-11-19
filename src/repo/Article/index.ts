import { NextFunction, Request, Response } from 'express';
import { Article } from '~/models/Article/articleSchema.js';
import { AppError } from '~/utils/appError.js';
import { ReporterProfile } from '~/models/Profile/reporterProfile.js';
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorId } = req.body;
    if (!authorId) {
      return next(new AppError("Can't find auther id in body", 404));
    }
    const existingAuthor = await ReporterProfile.findById(authorId);
    if (!existingAuthor) {
      return next(new AppError("Can't find auther id in DB", 404));
    }

    const newArticle = new Article({
      title: '',
      description: '',
      content: '',
      author: authorId,
      status: 'draft',
      sectionId: null, // Ban đầu chưa gắn với section nào
      tags: [],
      comments: []
    });
    const articleSaved = await newArticle.save();

    res.status(201).json({
      status: 'success',
      data: {
        articleId: articleSaved._id
      }
    });
  } catch (e) {
    console.log(e);

    next(new AppError("Can't create new aritcle", 500));
  }
};

export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    const { authorId, title, description, content, sectionId, tags, layout, images, videoUrl } = req.body;
    const article = await Article.findById(articleId);
    if (!article) {
      return next(new AppError("can't find article id in DB.", 404));
    }
    if (authorId != article?.author) {
      return next(new AppError("can't update article with different author id.", 404));
    }
    article.title = title || article.title;
    article.description = description || article.description;
    article.content = content || article.content;
    article.sectionId = sectionId || article.sectionId;
    article.tags = tags || article.tags;
    article.layout = layout || article.layout;
    article.images = images || article.images;
    article.videoUrl = videoUrl || article.videoUrl;

    const updatedArticle = await article.save();
    res.status(200).json({
      status: 'success',
      data: updatedArticle
    });
  } catch (e) {
    console.log(e);

    next(new AppError("Can't update aritcle", 500));
  }
};
