import express, { Response, Request, NextFunction } from 'express';
import { PATH } from '~/config/path.js';
import { getCommentsByArticle } from '~/controllers/commentController.js';

const commentApiRouter = express.Router();

/**
 * GET /post/:articleSlug/comment
 * Fetch all comments for a given article using the article's slug
 */
commentApiRouter.get(PATH.API.ARTICLE.COMMENTS, getCommentsByArticle);

export default commentApiRouter;
