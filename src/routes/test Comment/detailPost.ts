import express, { Request, Response, NextFunction } from 'express';

import { Article } from '~/models/Article/articleSchema.js';
import { getCommentsByArticleSlug } from '~/repo/comment/commentRepo.js';

const commentRouterTest = express.Router();

/**
 * Render trang chi tiết bài viết (bao gồm comment)
 */
// commentRouterTest.get('/:articleSlug', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { articleSlug } = req.params;

//     // Lấy bài viết theo slug
//     const article = await Article.findOne({ slug: articleSlug });
//     if (!article) {
//       return res.status(404).render('404', { message: 'Bài viết không tồn tại.' });
//     }

//     // Lấy các bình luận của bài viết
//     const comments = await getCommentsByArticleSlug(articleSlug);

//     // Render giao diện EJS
//     res.render('CommentTest/articleDetail', { article, comments });
//   } catch (error) {
//     next(error);
//   }
// });

/**
 * Lưu bình luận (API POST)
 */

export default commentRouterTest;
