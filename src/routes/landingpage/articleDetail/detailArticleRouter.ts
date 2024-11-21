import express from 'express';
import { PATH } from '~/config/path.js';
import { renderArticleDetail } from '~/controllers/landingpage/articleDetail/articleDetailController.js';
const detailArticleRouter = express.Router();

detailArticleRouter.get(PATH.LANDINGPAGE.ARTICLE_DETAIL, renderArticleDetail);

export default detailArticleRouter;
