import express from 'express';
import { PATH } from '~/config/path.js';
import { getLandingPage } from '~/controllers/landingpageController.js';
import { verifyRole } from '~/middlewares/verifyRole.js';

const landingRouter = express.Router();

landingRouter.get(PATH.HOME, getLandingPage);

export default landingRouter;
