import express from 'express';
import { PATH } from '~/config/path.js';

import { articleQuery, getArticleByStatus, reporterGetArticleByIdQuery } from '~/controllers/articleController.js';
export { queryArticleRouter };

import { verifyRole } from '~/middlewares/verifyRole.js';

const queryArticleRouter = express.Router();

queryArticleRouter.get(PATH.HOME, articleQuery);

const articleApiRouter = express.Router();
articleApiRouter.use(PATH.API.REPORTER.ARTICLE, verifyRole(['reporter']), reporterGetArticleByIdQuery);

articleApiRouter.get(PATH.API.ARTICLE.BASE, articleQuery);

articleApiRouter.get(PATH.API.AUTHOR.ARTICLE, getArticleByStatus);

export default articleApiRouter;
