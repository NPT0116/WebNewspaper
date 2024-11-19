import express from 'express';
import { PATH } from '~/config/path.js';
import { verifyRole } from '~/middlewares/verifyRole.js';

const landingRouter = express.Router();

landingRouter.get(PATH.HOME, verifyRole(['admin', 'reader']), (req, res) => {
  res.render('layouts/LandingPageLayout/LandingPageLayout', {
    body: '../../pages/LandingPage/LandingPage'
  });
});

export default landingRouter;
