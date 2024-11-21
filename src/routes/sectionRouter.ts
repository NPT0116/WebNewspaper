import express from 'express';
import { getArticlesBySectionSlug } from '~/controllers/articleController.js';

const sectionRouter = express.Router();

sectionRouter.get('/:sectionSlug', getArticlesBySectionSlug);

export default sectionRouter;
