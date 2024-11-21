import express from 'express';
import { PATH } from '~/config/path.js';


import { articleQuery, getArticleByStatus } from '~/controllers/articleController.js';

const articleApiRouter = express.Router();

articleApiRouter.get(PATH.API.ARTICLE.BASE, articleQuery);

articleApiRouter.get(PATH.API.AUTHOR.ARTICLE, getArticleByStatus);

export default articleApiRouter;
