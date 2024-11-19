import { PATH } from '~/config/path.js';
import sectionApi from './section/sectionApi.js';
import express from 'express';
import { queryArticleRouter } from './articleApi.js';
import tagApiRouter from './tagApi.js';
import tagRouter from './Tag/tagApi.js';
import { authorQueryArticleRouter } from './articleApi.js';
import commentApiRouter from './commentApi.js';
import articleApiRouter from './articleApi.js';
import writeArticleRouter from './Article/writeArticle.js';

const apiRouter = express.Router();

apiRouter.use(PATH.API.SECTION.BASE, sectionApi.sectionApiRouter);

apiRouter.use(PATH.API.ARTICLE.BASE, queryArticleRouter);

apiRouter.use(PATH.API.AUTHOR.ARTICLE, authorQueryArticleRouter);

apiRouter.use(PATH.API.REPORTER.TAG, tagApiRouter);

apiRouter.use(PATH.API.REPORTER.SECTION, sectionApi.sectionAuthorApiRouter);

apiRouter.use(PATH.API.SECTION.ARTICLE, sectionApi.sectionArticleApiRouter);

apiRouter.use(PATH.API.SECTION.BASE, sectionApi.sectionApiRouter);
apiRouter.use(PATH.API.ARTICLE.BASE, writeArticleRouter);
apiRouter.use(PATH.API.TAG.BASE, tagRouter);
apiRouter.use(PATH.HOME, commentApiRouter);
apiRouter.use(PATH.HOME, articleApiRouter);

export default apiRouter;
