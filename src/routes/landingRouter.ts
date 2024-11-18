import express from 'express';
import { PATH } from '~/config/path.js';
import { verifyRole } from '~/middlewares/verifyRole.js';
import { articleQuery } from '~/query/articleQuery.js';
import { articlePagination } from '~/controllers/articleController.js';

const landingRouter = express.Router();

landingRouter.get(PATH.HOME, verifyRole(['admin', 'reader']), (req, res) => {
  articlePagination(req, res);
  articleQuery(req);
  res.render('layouts/LandingPageLayout/LandingPageLayout', {
    body: '../../pages/LandingPage/LandingPage'
  });
});

export default landingRouter;
