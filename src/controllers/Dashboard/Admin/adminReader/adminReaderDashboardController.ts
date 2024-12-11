import { ReaderProfile } from '~/models/Profile/readerProfile.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
import { Account } from '~/models/Account/accountSchema.js';

interface readerWatchedArticles {
  articleId: {
    _id: mongoose.Types.ObjectId;
    title: string;
    images: string[];
  };
  viewedAt: Date;
}

interface IReaderAdminDashboard {
  _id: mongoose.Types.ObjectId;
  accountId?: mongoose.Types.ObjectId | IAccount;
  name: string;
  dob: Date | null;
  watchedArticles: readerWatchedArticles[];
}

export const renderAdminReaderPage = async (req: Request, res: Response) => {
  try {
    const readers = await ReaderProfile.find().populate('accountId').populate<{ watchedArticles: readerWatchedArticles[] }>('watchedArticles.articleId', '_id title images');

    const data: IReaderAdminDashboard[] = readers.map((reader) => ({
      _id: reader._id,
      accountId: reader.accountId,
      name: reader.name,
      dob: reader.dob,
      watchedArticles: reader.watchedArticles
        .sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime())
        .slice(0, 3)
        .map((watchedArticle) => ({
          articleId: {
            _id: watchedArticle.articleId._id,
            title: watchedArticle.articleId.title,
            images: watchedArticle.articleId.images
          },
          viewedAt: watchedArticle.viewedAt
        }))
    }));
    res.render('layouts/DashboardLayout/DashboardLayout', {
      body: '../../pages/DashboardPages/Admin/ReadersPage',
      data: { readers: data, role: 'admin' }
    });
  } catch (e) {
    console.error('Error retrieving section profiles:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

// id ở đây là của readerProfile nha
interface IReaderUpgrade {
  _id: mongoose.Types.ObjectId;
}
export const upgradeReaderToSubscriber = async (req: Request<IReaderUpgrade>, res: Response) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      res.status(400).json({ status: 'error', message: 'Invalid request' });
      return;
    }

    const reader = await ReaderProfile.findById(_id);
    if (!reader) {
      res.status(404).json({ status: 'error', message: 'Reader not found' });
      return;
    }

    reader.accountId = reader.accountId || undefined;
    if (!reader.accountId) {
      res.status(400).json({ status: 'error', message: 'Reader does not have an account' });
      return;
    }
    const account = await Account.findById(reader.accountId);
    if (!account) {
      res.status(404).json({ status: 'error', message: 'Account not found' });
      return;
    }
    account.isSubscriber = true;
    account.subscriptionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await account.save();

    res.redirect('/dashboard/admin/readers');
  } catch (e) {
    console.error('Error upgrading reader to subscriber:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
