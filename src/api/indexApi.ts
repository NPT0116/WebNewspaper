import { PATH } from '~/config/path.js';
import express from 'express';
import tagRouter from './Tag/tagApi.js';
import commentApiRouter from './Comment/commentApi.js';
import articleApiRouter from './articleApi.js';
import landingPageApiRouter from './LandingPage/landingPageApi.js';
import writeArticleRouter from './Article/writeArticle.js';
import sectionApiRouter from './section/sectionApi.js';

const apiRouter = express.Router();

apiRouter.use(PATH.API.SECTION.BASE, sectionApiRouter);
apiRouter.use(PATH.API.ARTICLE.BASE, writeArticleRouter);
apiRouter.use(PATH.API.TAG.BASE, tagRouter);
apiRouter.use(PATH.HOME, commentApiRouter);
apiRouter.use(PATH.HOME, articleApiRouter);
apiRouter.use(PATH.API.LANDINGPAGE.BASE, landingPageApiRouter);

export default apiRouter;
