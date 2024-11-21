import express from 'express';
import { PATH } from '~/config/path.js';
const postRouter = express.Router();

postRouter.get(PATH.ARTICLE.EDIT, (req, res) => {
  res.render('pages/EditorPage/EditorPage');
});
postRouter.get(PATH.POST.OUTLET.detail, (req, res) => {
  res.render('pages/PostDetailPage/PostDetailPage');
});

export default postRouter;
