import express from 'express';
import { PATH } from '~/config/path.js';
import { renderArticleDetail } from '~/controllers/articleDetailController.js';
const detailArticleRouter = express.Router();

detailArticleRouter.get('/:sectionSlug/:articleSlug', renderArticleDetail);

export default detailArticleRouter;
