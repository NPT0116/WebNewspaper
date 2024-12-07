import { NextFunction, Request, Response } from 'express';
import { Tag } from '~/models/Tag/tagSchema.js';
import { AppError } from '~/utils/appError.js';

export const tagQuery = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { search_value, pageNumber = 1, pageSize = 10 } = req.query;
    const pageNum = parseInt(pageNumber as string, 10);
    const size = parseInt(pageSize as string, 10);

    // Tạo điều kiện tìm kiếm
    let query: Record<string, any> = {};
    if (search_value && typeof search_value === 'string') {
      const regex = new RegExp(`^${search_value}`, 'i');
      query = { name: regex };
    }

    const skip = (pageNum - 1) * size;
    const tags = await Tag.find(query).skip(skip).limit(size);

    const totalTags = await Tag.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: tags.length,
      total: totalTags,
      data: {
        tags
      }
    });
  } catch (error) {
    next(new AppError('Failed to query tags', 500));
  }
};
