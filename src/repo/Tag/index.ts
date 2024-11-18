import { Request, Response, NextFunction } from 'express';
import { Tag } from '~/models/Tag/tagSchema.js';
import { AppError } from '~/utils/appError.js';

export const getTagList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tagList = await Tag.find({});
    if (!tagList.length) {
      next(new AppError("Can't get tag list from DB", 500));
    }
    res.status(200).json({
      status: 'success',
      data: tagList.map((tag) => ({
        id: tag._id,
        tagName: tag.name
      }))
    });
  } catch (e) {
    console.log(e);

    next(new AppError("Can't get tag list from DB", 500));
  }
};
