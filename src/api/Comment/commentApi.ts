import express, { Response, Request, NextFunction } from 'express';
import { PATH } from '~/config/path.js';
import { verifyRole } from '~/middlewares/verifyRole.js';
import { getCommentsByArticleSlug, saveComment } from '~/repo/comment/commentRepo.js';
import { AppError } from '~/utils/appError.js';
const commentApiRouter = express.Router();

/**
 * GET /post/:articleSlug/comment
 * Fetch all comments for a given article using the article's slug
 */
commentApiRouter.get('/:articleSlug/comments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { articleSlug } = req.params;

    const comments = await getCommentsByArticleSlug(articleSlug);

    res.status(200).json(comments);
  } catch (err) {
    next(new AppError('Errors fetching comments', 500));
  }
});
commentApiRouter.post('/:articleSlug/comments/save', verifyRole(['reader']), saveComment);
export default commentApiRouter;
