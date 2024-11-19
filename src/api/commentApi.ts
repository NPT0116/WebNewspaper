import express, { Response, Request, NextFunction } from 'express';
import { PATH } from '~/config/path.js';
import { getCommentsByArticleSlug } from '~/repo/Comment/commentRepo.js';
import { AppError } from '~/utils/appError.js';

const commentApiRouter = express.Router();

/**
 * GET /post/:articleSlug/comment
 * Fetch all comments for a given article using the article's slug
 */
commentApiRouter.get('/:sectionId/:articleSlug/comments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { articleSlug } = req.params;

    const comments = await getCommentsByArticleSlug(articleSlug);
    console.log(comments);

    res.status(200).json(comments);
  } catch (err) {
    next(new AppError('Errors fetching comments', 500));
  }
});

export default commentApiRouter;
