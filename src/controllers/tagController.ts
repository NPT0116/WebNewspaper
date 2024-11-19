import { Request, Response } from 'express';
import { Tag } from '~/models/Tag/tagSchema.js';
import { Section } from '~/models/Section/sectionSchema.js';

export const tagQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search_value } = req.query;

    if (!search_value || typeof search_value !== 'string') {
      return;
    }

    const regex = new RegExp(search_value, 'i');

    // Tìm kiếm trong Tag
    const tags = await Tag.find({ name: regex }).select('name description createdAt updatedAt');

    // Trả về kết quả tìm kiếm
    res.json({
      tags
    });
  } catch (err) {
    console.error('Error searching tags and sections:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
