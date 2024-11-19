import { Request, Response } from 'express';
import { Tag } from '~/models/Tag/tagSchema.js';
import { paginate } from './paginationController.js';
export const tagQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search_value, pageNumber = 1, pageSize = 10 } = req.query;

    if (!search_value || typeof search_value !== 'string') {
      res.status(400).json({ error: 'Invalid search_value' });
      return;
    }

    const regex = new RegExp(search_value, 'i');
    const pageNum = parseInt(pageNumber as string, 10);
    const size = parseInt(pageSize as string, 10);

    if (isNaN(pageNum) || isNaN(size) || pageNum <= 0 || size <= 0) {
      res.status(400).json({ error: 'Invalid pagination parameters' });
      return;
    }

    // Sử dụng hàm paginate để phân trang
    const result = await paginate(Tag, { name: regex }, pageNum, size);

    res.json(result);
  } catch (err) {
    console.error('Error searching tags:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
