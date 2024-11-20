import { Request, Response } from 'express';
import { Tag } from '~/models/Tag/tagSchema.js';
import { Section } from '~/models/Section/sectionSchema.js';

export const tagQuery = async (req: Request, res: Response): Promise<any> => {
  try {
    const { search_value } = req.query;

    // Validate the search_value
    if (!search_value || typeof search_value !== 'string') {
      return res.status(400).json({ error: 'Invalid search_value' });
    }

    // Create a regex to match names that start with search_value (case-insensitive)
    const regex = new RegExp(`^${search_value}`, 'i');

    // Search for tags whose names start with search_value
    const tags = await Tag.find({ name: regex }).select('name description createdAt updatedAt');

    // Return the search results
    res.status(200).json({
      status: 'success',
      tags
    });
  } catch (err) {
    console.error('Error searching tags:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
