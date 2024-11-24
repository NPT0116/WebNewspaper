import { NextFunction, Request, Response } from 'express';
import { IArticleCard } from '~/interfaces/Article/articleInterface.js';
import { Account } from '~/models/Account/accountSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import { ReaderProfile } from '~/models/Profile/readerProfile.js';
import { getLandingPageData } from '~/repo/Article/landingpage.js';
import { getSectionTree } from '~/repo/Section/index.js';
import { AppError } from '~/utils/appError.js';
import { profileReaderFindArticlesByIds } from '~/repo/Article/articleRepo.js';

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
      res.redirect('/');
      return;
    }

    res.render('pages/LandingPage/Profile/ProfilePage', {
      sections: sections,
      data: data,
      readerProfile: readerProfile,
      account: readerAccount,
      isSubscriber: user?.isSubscriber || false
    });
  } catch (error) {
    next(new AppError('Internal Server Error', 500));
  }
};
//WatchedArticle
export const getWatchedArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;

    // Fetch the reader profile
    const readerProfile = await ReaderProfile.findOne({ accountId: user?._id });

    // Fetch additional data
    const sections = await getSectionTree();
    const data = await getLandingPageData();

    if (!readerProfile) {
      res.redirect('/');
      return;
    }

    // Find articles based on watched articles and sort by viewedAt
    const articles = await profileReaderFindArticlesByIds(readerProfile, 10);

    // Map articles for response
    const response: IArticleCard[] = articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      isSubscribed: article.isSubscribed,
      sectionId: {
        _id: article.sectionId._id,
        name: article.sectionId.name,
        slug: article.sectionId.slug
      },
      tags: article.tags.map((tag: any) => ({
        name: tag.name,
        slug: tag.slug,
        _id: tag._id
      })),
      author: {
        name: article.author.name,
        _id: article.author._id
      },
      images: article.images
    }));

    // Render the page with the articles and pagination
    res.render('pages/LandingPage/Profile/WatchedArticlePage', {
      articles: response, // Pass the articles (which could be empty)
      sections: sections,
      data: data,
      readerProfile: readerProfile,
      isSubscriber: user?.isSubscriber || false
    });
  } catch (error) {
    next(new AppError('Internal Server Error', 500));
  }
};

// Controller
export const buyPremium = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError('User not authenticated', 400));
    }

    // Tìm tài khoản của người dùng dựa trên userId
    const account = await Account.findById(user._id);
    if (!account) {
      return next(new AppError('Account not found', 404));
    }

    account.isSubscriber = true;
    res.redirect('/profile');
    await account.save();
  } catch (error) {
    next(new AppError('Internal Server Error', 500));
  }
};
