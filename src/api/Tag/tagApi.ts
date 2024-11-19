import express from 'express';
import { PATH } from '~/config/path.js';
import { tagQuery } from '~/controllers/tagController.js';

const tagRouter = express.Router();

tagRouter.get(PATH.HOME, tagQuery);

export default tagRouter;
