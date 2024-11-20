import express, { Response, Request, NextFunction } from 'express';
import { PATH } from '~/config/path.js';
import { verifyRole } from '~/middlewares/verifyRole.js';
import { saveComment } from '~/repo/comment/commentRepo.js';
import { AppError } from '~/utils/appError.js';
import { getCommentsByArticle } from '~/controllers/commentController.js';

const commentApiRouter = express.Router();

/**
 * GET /post/:articleSlug/comment
 * Fetch all comments for a given article using the article's slug
 */

commentApiRouter.post('/:articleSlug/comments/save', verifyRole(['reader']), saveComment);
commentApiRouter.get(PATH.API.ARTICLE.COMMENTS, getCommentsByArticle);

export default commentApiRouter;
