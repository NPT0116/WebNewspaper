import { NextFunction, Request, Response } from 'express';
import { IArticleCard } from '~/interfaces/Article/articleInterface.js';
import { Account } from '~/models/Account/accountSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import { ReaderProfile } from '~/models/Profile/readerProfile.js';
import { getLandingPageData } from '~/repo/Article/landingpage.js';
import { getSectionTree } from '~/repo/Section/index.js';
import { AppError } from '~/utils/appError.js';
import { profileReaderFindArticlesByIds } from '~/repo/Article/articleRepo.js';
import { sendOtp } from '~/controllers/authentication/accountController.js';

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
      isSubscriber: user?.isSubscriber || false,
      isSendOtp: false
    });
  } catch (error) {
    next(new AppError('Internal Server Error', 500));
  }
};
//WatchedArticle
export const getWatchedArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ status: 'error', message: 'User not authenticated' });
      return;
    }

    // Fetch the reader profile
    const readerProfile = await ReaderProfile.findOne({ accountId: user?._id }).populate({
      path: 'watchedArticles.articleId', // Populate article details
      model: 'Article',
      populate: [
        { path: 'sectionId', model: 'Section' },
        { path: 'tags', model: 'Tag' },
        { path: 'author', model: 'ReporterProfile' }
      ]
    });

    if (!readerProfile) {
      res.redirect('/');
      return;
    }

    // Ensure watchedArticles is available
    if (!readerProfile.watchedArticles || readerProfile.watchedArticles.length === 0) {
      console.log('No watched articles found.');
      res.render('pages/LandingPage/Profile/WatchedArticlePage', {
        articles: [], // Pass empty array
        sections: await getSectionTree(),
        data: await getLandingPageData(),
        readerProfile: readerProfile,
        isSubscriber: user?.isSubscriber || false,
        isSendOtp: false
      });
      return;
    }

    // Map watched articles and sort by 'viewedAt' (most recent first)
    const response: IArticleCard[] = readerProfile.watchedArticles
      .map((watchedArticle) => {
        const article = watchedArticle.articleId as any;
        if (!article) {
          console.warn('Article not found for watchedArticle:', watchedArticle);
          return null; // Skip invalid entries
        }
        return {
          slug: article.slug,
          title: article.title,
          description: article.description,
          isSubscribed: article.isSubscribed,
          sectionId: {
            _id: article.sectionId?._id,
            name: article.sectionId?.name,
            slug: article.sectionId?.slug
          },
          tags:
            article.tags?.map((tag: any) => ({
              name: tag.name,
              slug: tag.slug,
              _id: tag._id
            })) || [],
          author: {
            name: article.author?.name,
            _id: article.author?._id
          },
          images: article.images || [],
          viewedAt: watchedArticle.viewedAt // Include viewedAt from watchedArticles
        };
      })
      .filter((article) => article !== null) // Filter out null entries
      .sort((a, b) => {
        // Sort by 'viewedAt' in descending order (latest first)
        return new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime();
      });

    // Render the page with sorted articles
    res.render('pages/LandingPage/Profile/WatchedArticlePage', {
      articles: response,
      sections: await getSectionTree(),
      data: await getLandingPageData(),
      readerProfile: readerProfile,
      isSubscriber: user?.isSubscriber || false
    });
  } catch (error) {
    console.error('Error in getWatchedArticle:', error); // Log the error
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

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

export const editProfile = async (req: Request, res: Response) => {
  try {
    const { email, username, fullname, dob, gender } = req.body;
    const accountId = req.user?._id; // Đảm bảo người dùng đã đăng nhập

    if (!accountId) {
      res.status(400).json({ error: 'User is not authenticated.' });
      return;
    }

    // Lấy tài khoản hiện tại
    const account = await Account.findById(accountId);
    if (!account) {
      res.status(404).json({ error: 'Account not found.' });
      return;
    }

    let isEmailChanged = false;

    // Kiểm tra email thay đổi
    if (email && email.trim() !== account.email) {
      isEmailChanged = true;
    }

    // Kiểm tra profileType để cập nhật thông tin cá nhân
    if (account.profileType === 'ReaderProfile') {
      const profile = await ReaderProfile.findById(account.profileId);
      if (!profile) {
        res.status(404).json({ error: 'Reader profile not found.' });
        return;
      }

      // Cập nhật thông tin hồ sơ
      if (fullname) profile.name = fullname.trim();
      if (dob) profile.dob = new Date(dob);
      if (gender) profile.gender = gender;

      await profile.save();
    } else {
      res.status(400).json({ error: 'Unsupported profile type for updates.' });
      return;
    }
    // Cập nhật tài khoản nếu không đổi email
    if (username && account.localAuth) {
      account.localAuth.username = username.trim();
    }

    await account.save();
    // Nếu email thay đổi, gửi OTP để xác thực
    if (isEmailChanged) {
      // Gửi OTP tới email cũ
      const otp = await sendOtp(account.email, fullname || 'Reader');
      account.resetOtp = otp; // Lưu OTP vào tài khoản để xác minh sau
      await account.save();

      // Cập nhật isSendOtp thành true để hiển thị modal OTP
      res.render('pages/LandingPage/Profile/ProfilePage', {
        isSendOtp: true,
        readerProfile: await ReaderProfile.findOne({ accountId: accountId }),
        account: account,
        sections: await getSectionTree(),
        data: await getLandingPageData(),
        isSubscriber: req.user?.isSubscriber || false,
        newEmail: email,
        email: account.email,
        error: ''
      });
      return;
    }

    res.redirect('/profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};

export const verifyProfileOtp = async (req: Request, res: Response): Promise<void> => {
  const { newEmail, email, otp } = req.body;
  // Tìm tài khoản theo email
  const account = await Account.findOne({ email });

  if (!account) {
    res.status(400).send('Account not found');
    return;
  }

  if (!otp) {
    res.render('pages/LandingPage/Profile/ProfilePage', {
      isSendOtp: true,
      readerProfile: await ReaderProfile.findOne({ accountId: req.user?._id }),
      account: account,
      sections: await getSectionTree(),
      data: await getLandingPageData(),
      isSubscriber: req.user?.isSubscriber || false,
      email: account.email,
      error: 'OTP is required'
    });
    return;
  }
  try {
    // Kiểm tra OTP
    if (account.resetOtp !== otp) {
      res.render('pages/LandingPage/Profile/ProfilePage', {
        isSendOtp: true,
        readerProfile: await ReaderProfile.findOne({ accountId: req.user?._id }),
        account: account,
        sections: await getSectionTree(),
        data: await getLandingPageData(),
        isSubscriber: req.user?.isSubscriber || false,
        email: account.email,
        error: 'Incorrect OTP'
      });
      return;
    }

    account.resetOtp = '';
    account.email = newEmail;
    const savedAccount = await account.save();
    if (!savedAccount) {
      console.error('Account not saved:', savedAccount);
    } else {
      res.redirect(`/profile`);
    }
  } catch (error) {
    console.error(error);
    return;
  }
};
