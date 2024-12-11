import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
import { ReporterProfile } from '~/models/Profile/reporterProfile.js';

interface IReporterAdminDashboard {
  _id: mongoose.Types.ObjectId;
  accountId?: mongoose.Types.ObjectId | IAccount;
  name: string;
  dob: Date | null;
  gender: 'male' | 'female' | 'other' | null;
}

export const renderAdmindReporterPage = async (req: Request, res: Response) => {
  try {
    // Retrieve all reporter profiles
    const reporterProfiles = await ReporterProfile.find().populate<{ accountId: IAccount }>('accountId');

    // Format the data according to the IReporterAdminDashboard interface
    const data: IReporterAdminDashboard[] = reporterProfiles.map((reporter) => ({
      _id: reporter._id,
      accountId: reporter.accountId,
      name: reporter.name,
      dob: reporter.dob,
      gender: reporter.gender
    }));

    // Render the page with the formatted data
    res.render('layouts/DashboardLayout/DashboardLayout', {
      body: '../../pages/DashboardPages/Admin/ReportersPage',
      data: { reporters: data, role: 'admin' }
    });
  } catch (error) {
    console.error('Error retrieving reporter profiles:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

// interface ICreateReporter{
//     name: string;

// }
