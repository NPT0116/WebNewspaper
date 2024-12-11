import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
import { ReporterProfile } from '~/models/Profile/reporterProfile.js';
import bcrypt from 'bcrypt';
import { Account } from '~/models/Account/accountSchema.js';
import { Article } from '~/models/Article/articleSchema.js';

interface IReportArticle {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  createdAt: Date;
  status: 'draft' | 'approved' | 'rejected' | 'published' | 'pending';
}
interface IReporterAdminDashboard {
  _id: mongoose.Types.ObjectId;
  accountId?: mongoose.Types.ObjectId | IAccount;
  name: string;
  dob: Date | null;
  gender: 'male' | 'female' | 'other' | null;
  reportArticles: IReportArticle[];
}

export const renderAdmindReporterPage = async (req: Request, res: Response) => {
  try {
    // Retrieve all reporter profiles
    const reporterProfiles = await ReporterProfile.find().populate<{ accountId: IAccount }>('accountId').populate<{ reportArticles: IReportArticle[] }>('reportArticles');

    // Format the data according to the IReporterAdminDashboard interface
    const data: IReporterAdminDashboard[] = reporterProfiles.map((reporter) => ({
      _id: reporter._id,
      accountId: reporter.accountId,
      name: reporter.name,
      dob: reporter.dob,
      gender: reporter.gender,
      reportArticles: reporter.reportArticles
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 3)
        .map((article) => ({
          _id: article._id,
          title: article.title,
          description: article.description,
          images: article.images,
          createdAt: article.createdAt,
          status: article.status
        }))
    }));

    // Render the page with the formatted data
    res.json({ reporters: data });
    // res.render('layouts/DashboardLayout/DashboardLayout', {
    //   body: '../../pages/DashboardPages/Admin/ReportersPage',
    //   data: { reporters: data, role: 'admin' }
    // });
  } catch (error) {
    console.error('Error retrieving reporter profiles:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

/*
{
{
  "name": "Jane Doe",
  "dob": "1990-01-01",
  "gender": "female",

    "email": "janedoe@example.com",
    "username": "janedoe",
    "password": "123"
}
}
*/

interface ICreateReporterAccount {}
interface ICreateReporter {
  name: string;
  dob: Date | null;
  gender: 'male' | 'female' | 'other' | null;
  email: string;
  username: string;
  password: string;
}

export const adminCreateReporter = async (req: Request<{}, {}, ICreateReporter>, res: Response) => {
  try {
    const { name, dob, gender, email, username, password } = req.body;
    if (!name || !dob || !gender || !email || !username || !password) {
      res.status(400).json({ status: 'error', message: 'Missing required fields' });
      return;
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newProfile = new ReporterProfile({ name, dob, gender });
    const savedProfile = await newProfile.save();
    const newAccount = new Account({
      email: email,
      localAuth: {
        username: username,
        password: hashedPassword
      },
      role: 'reporter',
      profileType: 'ReporterProfile',
      isSubscriber: false,
      profileId: savedProfile._id
    });
    const savedAccount = await newAccount.save();
    savedProfile.accountId = savedAccount._id;
    await savedProfile.save();
    res.redirect('/dashboard/admin/reporters');
  } catch (e) {
    console.error('Error creating reporter:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

interface IUpdateReporterAccount {}

interface IReporterUpdateProfile {
  _id: mongoose.Types.ObjectId;
  name: string;
  dob: Date | null;
  gender: 'male' | 'female' | 'other' | null;

  accountId: mongoose.Types.ObjectId;
  email: string;
  username: string;
}

export const updateReporter = async (req: Request<{}, {}, IReporterUpdateProfile>, res: Response) => {
  try {
    const { _id, name, dob, gender, accountId, username, email } = req.body;

    const updateReporter = await ReporterProfile.findByIdAndUpdate(_id, { name, dob, gender }, { new: true });

    const updateReporterAccount = await Account.findByIdAndUpdate(
      accountId,
      {
        'localAuth.username': username,
        email: email
      },
      { new: true }
    );
    if (!updateReporter || !updateReporterAccount) {
      res.status(404).json({ status: 'error', message: 'Not found' });
      return;
    }

    res.redirect('/dashboard/admin/reporters');
  } catch (e) {
    console.error('Error updating reporter:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

interface IDeleteReporter {
  reporterId: mongoose.Types.ObjectId;
}

export const adminDeleteReporter = async (req: Request<IDeleteReporter>, res: Response) => {
  try {
    const { reporterId } = req.params;
    // Find the reporter profile
    const reporterProfile = await ReporterProfile.findByIdAndDelete(reporterId);

    if (!reporterProfile) {
      res.status(404).json({ status: 'error', message: 'Reporter not found' });
      return;
    }

    const accountId = reporterProfile.accountId;
    const reporterAccount = await Account.findByIdAndDelete(accountId);
    if (!reporterAccount) {
      res.status(404).json({ status: 'error', message: 'Account not found' });
    }

    // Delete all articles authored by the reporter
    await Article.deleteMany({ author: reporterId });

    res.redirect('/dashboard/admin/reporters');
  } catch (e) {
    console.error('Error deleting reporter:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
