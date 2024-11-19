import express, { Response, Request, NextFunction } from 'express';
import { PATH } from '~/config/path.js';
export { queryArticleRouter, authorQueryArticleRouter };

import { articleQuery, authorArticleQuery } from '~/controllers/articleController.js';

const queryArticleRouter = express.Router();

const authorQueryArticleRouter = express.Router();

queryArticleRouter.get(PATH.HOME, articleQuery);

authorQueryArticleRouter.get(PATH.HOME, authorArticleQuery);

const articleApiRouter = express.Router();

export default articleApiRouter;
