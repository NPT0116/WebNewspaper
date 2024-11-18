import { Article } from '~/models/Article/articleSchema.js';
import { Request, Response } from 'express';

export const articlePagination = async (req: Request, res: Response) => {
  try {
    if (!req.query.page) return;
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const skip = (page - 1) * limit;

    const articles = await Article.find().skip(skip).limit(limit);
    const totalArticleCount = await Article.countDocuments();

    if (skip > totalArticleCount) {
      console.log('Page not found');
      return;
    }

    console.log({
      totalItems: totalArticleCount,
      totalPages: Math.ceil(totalArticleCount / limit),
      currentPage: page,
      itemsPerPage: limit,
      data: articles
    });
  } catch (err) {
    console.error('Error in article pagination:', err);
    throw err;
  }
};
