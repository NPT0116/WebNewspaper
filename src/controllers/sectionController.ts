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
    const sections = await Section.find({ name: regex }).populate('parentSection', 'name').select('name parentSection childSections createdAt updatedAt');

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

    const collectSectionIds = (section: any): string[] => {
      const childIds = section.childSections?.map(collectSectionIds) || [];
      return [section._id.toString(), ...childIds.flat()];
    };
    const sectionIds = collectSectionIds(rootSection);

    const articles = await Article.find({ sectionId: sectionIds }).select('title content createdAt updatedAt');

    // Trả kết quả
    res.json({
      sectionId,
      sectionName: rootSection.name,
      articles
    });
  } catch (err) {
    console.error('Error fetching articles by section:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
