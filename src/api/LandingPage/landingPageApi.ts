import { Request, Response, NextFunction } from 'express';
import { getLandingPageData } from '~/repo/Article/landingpage.js';
import { AppError } from '~/utils/appError.js';
import express from 'express';
import { PATH } from '~/config/path.js';
const landingPageApiRouter = express.Router();
landingPageApiRouter.use(PATH.HOME, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getLandingPageData();
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    next(new AppError('Error fetching landing page data.', 500));
  }
});
export default landingPageApiRouter;
