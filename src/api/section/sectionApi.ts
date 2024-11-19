import express, { Response, Request, NextFunction } from 'express';
import { PATH } from '~/config/path.js';
import { getSectionsList, getSectionTree } from '~/repo/Section/index.js';
import { AppError } from '~/utils/appError.js'; // Custom error class
import { sectionQuery, getArticlesBySection } from '~/controllers/sectionController.js';

const sectionApiRouter = express.Router();
const sectionAuthorApiRouter = express.Router();
const sectionArticleApiRouter = express.Router();

/**
 * GET /api/sections
 * Trả về menu section bao gồm đầy đủ tất cả các cấp
 */
sectionApiRouter.get(PATH.API.SECTION.SECTION_TREE, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sectionTree = await getSectionTree();

    if (!sectionTree) {
      next(new AppError('Unable to fetch section tree.', 500));
    }

    res.status(200).json({
      status: 'success',
      data: sectionTree
    });
  } catch (err) {
    console.error(err);

    next(new AppError("Can't get sections from DB", 500));
  }
});
sectionApiRouter.get(PATH.HOME, getSectionsList);
sectionAuthorApiRouter.get(PATH.HOME, sectionQuery);

sectionArticleApiRouter.get(PATH.HOME, getArticlesBySection);

export default { sectionApiRouter, sectionAuthorApiRouter, sectionArticleApiRouter };
