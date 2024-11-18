import { Request } from 'express';
import { Article } from '~/models/Article/articleSchema.js';

export const articleQuery = async (req: Request) => {
  try {
    const { search_value } = req.query;
    if (!search_value) {
      return;
    }

    const query = {
      $or: [{ title: { $regex: search_value, $options: 'i' } }, { content: { $regex: search_value, $options: 'i' } }]
    };

    const articles = await Article.find(query);

    console.log(articles);

    return articles;
  } catch (err) {
    console.error('Error querying articles:', err);
    throw err;
  }
};
