import express from 'express';
import { PATH } from '~/config/path.js';
import { sectionQuery } from '~/controllers/sectionController.js';

import { tagQuery } from '~/controllers/tagController.js';

const apiRouter = express.Router();

apiRouter.get('/api/tags', tagQuery);

apiRouter.get('/api/sections', sectionQuery);

export default apiRouter;
