import express from 'express';
import { PATH } from '~/config/path.js';
const landingRouter = express.Router();

landingRouter.get(PATH.HOME, (req, res) => {
  res.render('layouts/LandingPageLayout/LandingPageLayout', {
    body: '../../pages/LandingPage/LandingPage'
  });
});

export default landingRouter;
