import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Section } from '~/models/Section/sectionSchema.js';
import { getLandingPageData } from '~/repo/Article/landingpage.js';
import { AppError } from '~/utils/appError.js';

export const getLandingPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getLandingPageData();
    res.render('layouts/LandingPageLayout/LandingPageLayout', {
      body: '../../pages/LandingPage/LandingPage',
      data
    });
  } catch (error) {
    console.error(error);
    next(new AppError('Error fetching landing page data.', 500));
  }
};
