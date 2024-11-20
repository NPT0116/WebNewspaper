import { Request, Response, NextFunction } from 'express';
import { ICommentResponse } from '~/interfaces/Comment/ commentInterface.js';
import { getCommentsByArticleSlug } from '~/repo/comment/commentRepo.js';
import { AppError } from '~/utils/appError.js';

export const getCommentsByArticle = async (req: Request<{ sectionSlug: string; articleSlug: string }>, res: Response<ICommentResponse[]>, next: NextFunction) => {
  try {
    const { sectionSlug, articleSlug } = req.params;

    // Get comments from the service/repository
    const comments: ICommentResponse[] = await getCommentsByArticleSlug(sectionSlug, articleSlug);

    // Send the response with status 200
    res.status(200).json(comments);
  } catch (err) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : 'Error fetching comments';

    // If the error has a status code, use it, else default to 500
    next(new AppError(message, statusCode));
  }
};
