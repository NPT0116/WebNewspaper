import { PATH } from '~/config/path.js';
import sectionApiRouter from './sectionApi.js';
import express from 'express';

const apiRouter = express.Router();

apiRouter.use(PATH.API.SECTION.BASE, sectionApiRouter);

export default apiRouter;
