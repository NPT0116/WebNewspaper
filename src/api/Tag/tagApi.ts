import express from 'express';
import { PATH } from '~/config/path.js';
import { getTagList } from '~/repo/Tag/index.js';

const tagRouter = express.Router();

tagRouter.get(PATH.HOME, getTagList);

export default tagRouter;
