import express from 'express';
import { PATH } from '~/config/path.js';
import { getPreviewPage } from '~/controllers/dashboard/PreviewArticle/previewArticleController.js';
import { verifyRole } from '~/middlewares/verifyRole.js';
const previewArticleRouter = express.Router();

previewArticleRouter.get(PATH.DASHBOARD.PREVIEW, getPreviewPage);

export default previewArticleRouter;
