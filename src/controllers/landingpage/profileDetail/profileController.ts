import { NextFunction, Request, Response } from 'express';
import { Account } from '~/models/Account/accountSchema.js';
import { ReaderProfile } from '~/models/Profile/readerProfile.js';
import { getLandingPageData } from '~/repo/Article/landingpage.js';
import { getSectionTree } from '~/repo/Section/index.js';
import { AppError } from '~/utils/appError.js';

// Controller to render reader profile data
export const getReaderProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const readerProfile = await ReaderProfile.findOne({ accountId: user?._id });
    const readerAccount = await Account.findById(user?._id);
    // Fetch additional data
    const sections = await getSectionTree();
    const data = await getLandingPageData();
    if (!readerProfile) {
      next(new AppError('Reader Profile not found', 404));
      return;
    }

    res.render('pages/LandingPage/ProfilePage', {
      sections: sections,
      data: data,
      profile: readerProfile,
      account: readerAccount
    });
  } catch (error) {
    next(new AppError('Internal Server Error', 500));
  }
};
