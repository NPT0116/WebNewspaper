import { Request, Response } from 'express';
import { Section } from '~/models/Section/sectionSchema.js';

interface GetSecTionByNameQuery {
  search_value: string;
  pageNumber: string;
  pageSize: string;
}

//Tìm kiếm secion theo tên section
export const sectionQuery = async (req: Request<{}, {}, {}, GetSecTionByNameQuery>, res: Response): Promise<void> => {
  try {
    const { search_value, pageNumber = 1, pageSize = 10 } = req.query;

    if (!search_value || typeof search_value !== 'string') {
      res.status(400).json({ error: 'Invalid search_value' });
      return;
    }

    // Tạo regex tìm kiếm
    const regex = new RegExp(`^${search_value}`, 'i');
    const pageNum = parseInt(pageNumber as string, 10);
    const size = parseInt(pageSize as string, 10);

    if (isNaN(pageNum) || isNaN(size) || pageNum <= 0 || size <= 0) {
      res.status(400).json({ error: 'Invalid pagination parameters' });
      return;
    }
    const query = { name: regex };
    const skip = (pageNum - 1) * size;
    const sections = await Section.find(query).skip(skip).limit(size);

    const totalSections = await Section.countDocuments(query);
    const totalPages = Math.ceil(totalSections / size);
    if (skip >= totalSections && skip !== 0) {
      res.status(404).json({ error: 'Page not found' });
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
    console.error('Error searching sections:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
