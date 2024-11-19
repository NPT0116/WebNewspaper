import { PATH } from '~/config/path.js';
import sectionApiRouter from './section/sectionApi.js';
import express from 'express';
import writeArticleRouter from './Article/writeArticle.js';
import tagRouter from './Tag/tagApi.js';
import commentApiRouter from './commentApi.js';
import articleApiRouter from './articleApi.js';

const apiRouter = express.Router();

apiRouter.use(PATH.API.SECTION.BASE, sectionApiRouter);
apiRouter.use(PATH.API.ARTICLE.BASE, writeArticleRouter);
apiRouter.use(PATH.API.TAG.BASE, tagRouter);
apiRouter.use(PATH.HOME, commentApiRouter);
apiRouter.use(PATH.HOME, articleApiRouter);

export default apiRouter;
