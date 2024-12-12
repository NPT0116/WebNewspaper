import express, { NextFunction, Response, Request } from 'express';
import { PATH } from '~/config/path.js';
import { renderArticleDetail, verifySubscription, renderArticleDetailInFlippingMode } from '~/controllers/landingpage/articleDetail/articleDetailController.js';
import { watchArticleHandler } from '~/middlewares/watchArticleHandler.js';
import { saveComment } from '~/repo/comment/commentRepo.js';

const detailArticleRouter = express.Router();

interface IArticleDetailParams {
  sectionSlug: string;
  articleSlug: string;
}

detailArticleRouter.get(
  PATH.LANDINGPAGE.ARTICLE_DETAIL,
  verifySubscription,
  (req: Request<IArticleDetailParams>, res: Response, next: NextFunction) => {
    watchArticleHandler(req, res, next);
  },
  renderArticleDetail
);
detailArticleRouter.get(
  PATH.LANDINGPAGE.ARTICLE_DETAIL_FLIPPING,
  verifySubscription,
  (req: Request<IArticleDetailParams>, res: Response, next: NextFunction) => {
    watchArticleHandler(req, res, next);
  },
  renderArticleDetailInFlippingMode
);

detailArticleRouter.post(PATH.LANDINGPAGE.SAVE_COMMENT, saveComment);

export default detailArticleRouter;
