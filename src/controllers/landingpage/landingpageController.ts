import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Account } from '~/models/Account/accountSchema.js';
import { getLandingPageData } from '~/repo/Article/landingpage.js';
import { getSectionTree } from '~/repo/Section/index.js';
import { AppError } from '~/utils/appError.js';

interface IProfile {
  id: mongoose.Types.ObjectId;
  name: string;
}
export const getProfile = async (accountId: mongoose.Types.ObjectId) => {
  try {
    const account = await Account.findById(accountId).populate<{ profileId: IProfile }>('profileId', 'name');
    return {
      email: account?.email,
      isSubscriber: account?.isSubscriber,
      profileId: account?.profileId.id,
      profileName: account?.profileId.name,
      role: account?.role
    };
  } catch (e) {
    return null;
  }
};

export const getLandingPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getLandingPageData();
    const sections = await getSectionTree();
    let profile = null;
    if (req.isAuthenticated()) {
      profile = await getProfile(req.user._id);
    }
    // res.json(data);
    res.render('layouts/LandingPageLayout/LandingPageLayout', {
      body: '../../pages/LandingPage/LandingPage',
      sections,
      data,
      profile
    });
    // res.json({
    //   body: '../../pages/LandingPage/LandingPage',
    //   sections,
    //   data,
    //   profile
    // });
  } catch (error) {
    console.error(error);
    next(new AppError('Error fetching landing page data.', 500));
  }
};
