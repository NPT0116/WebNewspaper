import express, { Response, Request, NextFunction } from 'express';
import { PATH } from '~/config/path.js';
import { Section } from '~/models/Section/sectionSchema.js';

import { AppError } from '~/utils/appError.js';
import { sectionQuery, getArticlesBySection } from '~/controllers/sectionController.js';

const sectionApiRouter = express.Router();
const sectionAuthorApiRouter = express.Router();
const sectionArticleApiRouter = express.Router();
/**
 * GET /api/sections
    trả về menu section bao gồm đầy đủ tất cả các cấp
 */
sectionApiRouter.get(PATH.HOME, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await Section.find({ parentSection: null }).populate({
      path: 'childSections',
      populate: {
        path: 'childSections', // Populate cấp con của con (nested populate)
        populate: {
          path: 'childSections' // Tiếp tục nếu có thêm cấp sâu hơn
        }
      }
    });

    const buildSectionTree = (section: any) => ({
      id: section._id,
      name: section.name,
      childSections: section.childSections.map(buildSectionTree)
    });
    const response = section.map(buildSectionTree);
    console.log(response);

    res.status(200).json(response);
  } catch (err) {
    next(new AppError("Can't get sections list ", 500));
  }
});

sectionAuthorApiRouter.get(PATH.HOME, sectionQuery);

sectionArticleApiRouter.get(PATH.HOME, getArticlesBySection);

export default { sectionApiRouter, sectionAuthorApiRouter, sectionArticleApiRouter };
