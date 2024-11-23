import express from 'express';
import { PATH } from '~/config/path.js';
import { renderArticleDetail } from '~/controllers/landingpage/articleDetail/articleDetailController.js';
import { saveComment } from '~/repo/comment/commentRepo.js';
const detailArticleRouter = express.Router();

detailArticleRouter.get(PATH.LANDINGPAGE.ARTICLE_DETAIL, renderArticleDetail);
detailArticleRouter.post(PATH.LANDINGPAGE.SAVE_COMMENT, saveComment);

export default detailArticleRouter;
