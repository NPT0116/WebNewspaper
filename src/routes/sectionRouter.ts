import express from 'express';
import { PATH } from '~/config/path.js';
import { getArticlesBySectionSlug } from '~/controllers/articleController.js';

const sectionRouter = express.Router();

sectionRouter.get(PATH.LANDINGPAGE.SECTION, getArticlesBySectionSlug);

export default sectionRouter;
