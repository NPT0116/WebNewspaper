import express from 'express';
import { PATH } from '~/config/path.js';

import { tagQuery } from '~/controllers/tagController.js';

const tagApiRouter = express.Router();

tagApiRouter.get(PATH.HOME, tagQuery);

export default tagApiRouter;
