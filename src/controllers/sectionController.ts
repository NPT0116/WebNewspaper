import { Request, Response } from 'express';
import { Section } from '~/models/Section/sectionSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import mongoose from 'mongoose';
import { paginate } from './paginationController.js';
//Tìm kiếm secion theo tên section
export const sectionQuery = async (req: Request, res: Response): Promise<void> => {
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

    // Sử dụng hàm paginate để phân trang
    const result = await paginate(Section, { name: regex }, pageNum, size);

    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (err) {
    console.error('Error searching sections:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Tìm kiếm bài viết theo sectionId
export const getArticlesBySection = async (req: Request, res: Response): Promise<void> => {
  try {
    const sectionIdMatch = req.originalUrl.match(/\/api\/sections\/([a-fA-F0-9]{24})/);

    if (!sectionIdMatch || !sectionIdMatch[1]) {
      res.status(400).json({ message: 'sectionId is required in the URL' });
      return;
    }

    const sectionId = sectionIdMatch[1];

    if (!mongoose.isValidObjectId(sectionId)) {
      res.status(400).json({ message: 'Invalid sectionId' });
      return;
    }

    const rootSection = await Section.findById(sectionId).populate({
      path: 'childSections',
      populate: {
        path: 'childSections',
        populate: {
          path: 'childSections'
        }
      }
    });

    if (!rootSection) {
      res.status(404).json({ message: 'Section not found' });
      return;
    }

    const collectSectionIds = (section: any): string[] => {
      const childIds = section.childSections?.map(collectSectionIds) || [];
      return [section._id.toString(), ...childIds.flat()];
    };
    const sectionIds = collectSectionIds(rootSection);

    const { pageNumber = 1, pageSize = 10 } = req.query;
    const pageNum = parseInt(pageNumber as string, 10);
    const size = parseInt(pageSize as string, 10);

    if (isNaN(pageNum) || isNaN(size) || pageNum <= 0 || size <= 0) {
      res.status(400).json({ error: 'Invalid pagination parameters' });
      return;
    }

    const result = await paginate(Article, { sectionId: { $in: sectionIds } }, pageNum, size);

    res.json(result);
  } catch (err) {
    console.error('Error fetching articles by section:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
