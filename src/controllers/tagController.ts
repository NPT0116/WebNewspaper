import { NextFunction, Request, Response } from 'express';
import { Tag } from '~/models/Tag/tagSchema.js';
import { AppError } from '~/utils/appError.js';

interface TagQuery {
  search_value: string;
  pageNumber: string;
  pageSize: string;
}

export const tagQuery = async (req: Request<{}, {}, {}, TagQuery>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search_value, pageNumber = 1, pageSize = 10 } = req.query;
    const pageNum = parseInt(pageNumber as string, 10);
    const size = parseInt(pageSize as string, 10);

    if (isNaN(pageNum) || isNaN(size) || pageNum <= 0 || size <= 0) {
      next(new AppError('Invalid pagination parameters', 400));
      return;
    }

    // Tạo điều kiện tìm kiếm
    let query: Record<string, any> = {};
    if (search_value) {
      const regex = new RegExp(`^${search_value}`, 'i');
      query = { name: regex };
    }

    const skip = (pageNum - 1) * size;
    const sections = await Tag.find(query).skip(skip).limit(size);

    const totalSections = await Tag.countDocuments(query);
    const totalPages = Math.ceil(totalSections / size);

    if (skip >= totalSections && skip !== 0) {
      next(new AppError('Page not found', 404));
      return;
    }

    res.json({
      data: sections,
      totalItems: totalSections,
      totalPages: totalPages,
      currentPage: pageNum,
      itemsPerPage: size
    });
  } catch (err) {
    next(new AppError('Internal server error', 500));
  }
};
