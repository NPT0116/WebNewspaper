import { PATH } from '~/config/path.js';
import sectionApi from './sectionApi.js';
import express from 'express';
import { queryArticleRouter } from './articleApi.js';
import tagApiRouter from './tagApi.js';
import { authorQueryArticleRouter } from './articleApi.js';

const apiRouter = express.Router();

apiRouter.use(PATH.API.SECTION.BASE, sectionApi.sectionApiRouter);

apiRouter.use(PATH.API.ARTICLE.BASE, queryArticleRouter);

apiRouter.use(PATH.API.AUTHOR.ARTICLE, authorQueryArticleRouter);

apiRouter.use(PATH.API.REPORTER.TAG, tagApiRouter);

apiRouter.use(PATH.API.REPORTER.SECTION, sectionApi.sectionAuthorApiRouter);

apiRouter.use(PATH.API.SECTION.ARTICLE, sectionApi.sectionArticleApiRouter);

export default apiRouter;
