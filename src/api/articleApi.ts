import express from 'express';
import { PATH } from '~/config/path.js';

import { articleQuery, authorArticleQuery } from '~/controllers/articleController.js';

const queryArticleRouter = express.Router();

const authorQueryArticleRouter = express.Router();

queryArticleRouter.get(PATH.HOME, articleQuery);

authorQueryArticleRouter.get(PATH.HOME, authorArticleQuery);

export { queryArticleRouter, authorQueryArticleRouter };
