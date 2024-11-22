import express, { NextFunction, Response, Request } from 'express';
import mongoose from 'mongoose';
import { PATH } from '~/config/path.js';
import { renderArticleDetail } from '~/controllers/landingpage/articleDetail/articleDetailController.js';
import { watchArticleHandler } from '~/middlewares/watchArticleHandler.js';

const detailArticleRouter = express.Router();

interface IArticleDetailParams {
  sectionSlug: string;
  articleSlug: string;
}

detailArticleRouter.get(
  PATH.LANDINGPAGE.ARTICLE_DETAIL,
  (req: Request<IArticleDetailParams>, res: Response, next: NextFunction) => {
    watchArticleHandler(req, res, next);
  },
  renderArticleDetail
);

export default detailArticleRouter;
