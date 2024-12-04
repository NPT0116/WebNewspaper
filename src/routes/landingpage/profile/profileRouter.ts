import express from 'express';
import { PATH } from '~/config/path.js';
import { buyPremium, getReaderProfile, getWatchedArticle } from '~/controllers/landingpage/profileDetail/profileController.js';

const profileRouter = express.Router();

profileRouter.get(PATH.LANDINGPAGE.PROFILE, getReaderProfile);

profileRouter.get(PATH.LANDINGPAGE.WATCHED_ARTICLE, getWatchedArticle);

profileRouter.post('/buy-premium', buyPremium);

export default profileRouter;
