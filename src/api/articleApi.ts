import express, { Response, Request, NextFunction } from 'express';
import { PATH } from '~/config/path.js';
export { queryArticleRouter, authorQueryArticleRouter };

import { articleQuery, authorArticleQuery, reporterGetArticleByIdQuery } from '~/controllers/articleController.js';
import { verifyRole } from '~/middlewares/verifyRole.js';

const queryArticleRouter = express.Router();

const authorQueryArticleRouter = express.Router();

queryArticleRouter.get(PATH.HOME, articleQuery);

authorQueryArticleRouter.get(PATH.HOME, authorArticleQuery);

const articleApiRouter = express.Router();
articleApiRouter.use(PATH.API.REPORTER.ARTICLE, verifyRole(['reporter']), reporterGetArticleByIdQuery);

export default articleApiRouter;
