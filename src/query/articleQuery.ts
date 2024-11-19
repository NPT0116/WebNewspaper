import { Request, Response } from 'express';
import { Article } from '~/models/Article/articleSchema.js';

export const searchArticleQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.query) {
      return;
    }
    const { search_value } = req.query;
    if (!search_value) {
      return;
    }

    const query = {
      $or: [{ title: { $regex: search_value, $options: 'i' } }, { content: { $regex: search_value, $options: 'i' } }]
    };

    const articles = await Article.find(query);

    res.json(articles);
    return;
  } catch (err) {
    res.status(500).json({ error: `Error querying articles: ${err}` });
    return;
  }
};
