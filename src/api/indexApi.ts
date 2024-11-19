import { PATH } from '~/config/path.js';
import express from 'express';
import sectionApiRouter from './sectionApi.js';
import commentApiRouter from './commentApi.js';
import articleApiRouter from './articleApi.js';

const apiRouter = express.Router();

apiRouter.use(PATH.API.SECTION.BASE, sectionApiRouter);
apiRouter.use(PATH.HOME, commentApiRouter);
apiRouter.use(PATH.HOME, articleApiRouter);

export default apiRouter;
