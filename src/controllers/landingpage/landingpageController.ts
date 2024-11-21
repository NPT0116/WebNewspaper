import { Request, Response, NextFunction } from 'express';
import { getLandingPageData } from '~/repo/Article/landingpage.js';
import { getSectionTree } from '~/repo/Section/index.js';
import { AppError } from '~/utils/appError.js';

export const getLandingPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getLandingPageData();
    const sections = await getSectionTree();
    // res.json(data);
    res.render('layouts/LandingPageLayout/LandingPageLayout', {
      body: '../../pages/LandingPage/LandingPage',
      sections,
      data
    });
  } catch (error) {
    console.error(error);
    next(new AppError('Error fetching landing page data.', 500));
  }
};
