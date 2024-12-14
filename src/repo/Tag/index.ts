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

export interface ITagBasicInfo {
  id: string;
  slug: string;
  name: string;
}

export const getAllTags = async (): Promise<ITagBasicInfo[]> => {
  try {
    const allTags = await Tag.find({});

    if (!allTags) {
      throw new AppError('Unable to get all tags', 404);
    }

    const responseTags: ITagBasicInfo[] = allTags.map((tag) => {
      return {
        id: tag._id.toString(),
        slug: tag.slug,
        name: tag.name
      };
    });

    return responseTags;
  } catch (error) {
    throw new AppError('Error getting all tags', 404);
  }
};

export const getTagIdBySlug = async (slug: string): Promise<string> => {
  try {
    console.log(slug);
    const tag = await Tag.findOne({ slug });

    if (!tag) {
      throw new AppError('Unable to get tag', 404);
    }

    const id = tag._id.toString();

    return id;
  } catch (error) {
    throw new AppError('Error getting tag', 404);
  }
};
