import { Request, Response } from 'express';
import { Section } from '~/models/Section/sectionSchema.js';

export const sectionQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search_value } = req.query;

    if (!search_value || typeof search_value !== 'string') {
      return;
    }

    const regex = new RegExp(search_value, 'i');

    // Tìm kiếm trong Section
    const sections = await Section.find({ name: regex })
      .populate('parentSection', 'name') // Bao gồm tên của parentSection
      .select('name parentSection childSections createdAt updatedAt');

    // Trả về kết quả tìm kiếm
    res.json({
      sections
    });
  } catch (err) {
    console.error('Error searching tags and sections:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
