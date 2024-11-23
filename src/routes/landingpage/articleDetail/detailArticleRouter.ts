import express, { NextFunction, Response, Request } from 'express';
import { PATH } from '~/config/path.js';
import { renderArticleDetail } from '~/controllers/landingpage/articleDetail/articleDetailController.js';
import { watchArticleHandler } from '~/middlewares/watchArticleHandler.js';
import { saveComment } from '~/repo/comment/commentRepo.js';

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

detailArticleRouter.post(PATH.LANDINGPAGE.SAVE_COMMENT, saveComment);

export default detailArticleRouter;
