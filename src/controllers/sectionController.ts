import { Request, Response } from 'express';
import { Section } from '~/models/Section/sectionSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import mongoose from 'mongoose';

//Tìm kiếm secion theo tên section
export const sectionQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search_value } = req.query;

    if (!search_value || typeof search_value !== 'string') {
      return;
    }

    const regex = new RegExp(search_value, 'i');

    // Tìm kiếm trong Section
    const sections = await Section.find({ name: regex }).select('name parentSection childSections createdAt updatedAt');

    // Trả về kết quả tìm kiếm
    res.json({
      sections
    });
  } catch (err) {
    console.error('Error searching tags and sections:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Tìm kiếm bài viết theo sectionId
export const getArticlesBySection = async (req: Request, res: Response): Promise<void> => {
  try {
    // Lấy sectionId từ req.originalUrl
    const sectionIdMatch = req.originalUrl.match(/\/api\/([^/]+)\//);

    if (!sectionIdMatch || !sectionIdMatch[1]) {
      res.status(400).json({ message: 'sectionId is required in the URL' });
      return;
    }

    const sectionId = sectionIdMatch[1];

    // Xác minh sectionId
    if (!mongoose.isValidObjectId(sectionId)) {
      res.status(400).json({ message: 'Invalid sectionId' });
      return;
    }

    console.log(sectionId);

    // Tìm root section dựa trên sectionId
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

    // Hàm thu thập tất cả các sectionId con
    const collectSectionIds = (section: any): string[] => {
      const childIds = section.childSections?.map(collectSectionIds) || [];
      return [section._id.toString(), ...childIds.flat()];
    };
    const sectionIds = collectSectionIds(rootSection);

    // Lấy các tham số phân trang
    const { pageNumber = 1, pageSize = 10 } = req.query;

    const pageNum = parseInt(pageNumber as string, 10);
    const size = parseInt(pageSize as string, 10);

    if (isNaN(pageNum) || isNaN(size) || pageNum <= 0 || size <= 0) {
      res.status(400).json({ error: 'Invalid pagination parameters' });
      return;
    }

    const skip = (pageNum - 1) * size;

    const articles = await Article.find({ sectionId: { $in: sectionIds } })
      .skip(skip)
      .limit(size)
      .select('title content createdAt updatedAt');

    const totalArticleCount = await Article.countDocuments({ sectionId: { $in: sectionIds } });

    if (skip > totalArticleCount) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    // Trả về kết quả với phân trang
    res.json({
      totalItems: totalArticleCount,
      totalPages: Math.ceil(totalArticleCount / size),
      currentPage: pageNum,
      itemsPerPage: size,
      data: articles
    });
  } catch (err) {
    console.error('Error fetching articles by section:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
