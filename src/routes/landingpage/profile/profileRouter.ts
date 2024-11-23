import express from 'express';
import { PATH } from '~/config/path.js';
import { getReaderProfile } from '~/controllers/landingpage/profileDetail/profileController.js';

const profileRouter = express.Router();

profileRouter.get(PATH.LANDINGPAGE.PROFILE, getReaderProfile);

export default profileRouter;
