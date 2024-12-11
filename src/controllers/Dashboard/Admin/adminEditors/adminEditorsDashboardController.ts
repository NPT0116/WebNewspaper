import { Account } from '~/models/Account/accountSchema.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
import { EditorProfile } from '~/models/Profile/editorProfile.js';
import bcrypt from 'bcrypt';
interface IEditorAdminDashboard {
  _id: mongoose.Types.ObjectId;
  accountId?: mongoose.Types.ObjectId | IAccount;
  name: string;
  dob: Date | null;
  gender: 'male' | 'female' | 'other' | null;
  sectionId: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
}

export const renderAdminEditorPage = async (req: Request, res: Response) => {
  try {
    // Retrieve all editor profiles
    const editorProfiles = await EditorProfile.find().populate<{ accountId: IAccount }>('accountId').populate<{ sectionId: { _id: mongoose.Types.ObjectId; name: string } }>('sectionId');
    const data: IEditorAdminDashboard[] = editorProfiles.map((editor) => ({
      _id: editor._id,
      accountId: editor.accountId,
      name: editor.name,
      dob: editor.dob,
      gender: editor.gender,
      sectionId: {
        _id: editor.sectionId._id,
        name: editor.sectionId.name
      }
    }));

    // Render the page with the formatted data
    // res.render('layouts/DashboardLayout/DashboardLayout', {
    //   body: '../../pages/DashboardPages/Admin/EditorsPage',
    //   data: { editors: data, role: 'admin' }
    // });
    res.json({ editors: data });
  } catch (error) {
    console.error('Error retrieving editor profiles:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

interface ICreateEditor {
  name: string;
  dob: Date | null;
  gender: 'male' | 'female' | 'other' | null;
  sectionId: mongoose.Types.ObjectId;
  email: string;
  username: string;
  password: string;
}

export const adminCreateEditor = async (req: Request<{}, {}, ICreateEditor>, res: Response) => {
  try {
    const { name, dob, gender, sectionId, email, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new editor profile
    const newProfile = new EditorProfile({ name, dob, gender, sectionId });
    const savedProfile = await newProfile.save();

    // Create a new account for the editor
    const newAccount = new Account({
      email: email,
      localAuth: {
        username: username,
        password: hashedPassword
      },
      role: 'editor',
      profileType: 'EditorProfile',
      isSubscriber: false,
      profileId: savedProfile._id
    });
    const savedAccount = await newAccount.save();

    // Link the account to the profile
    savedProfile.accountId = savedAccount._id;
    await savedProfile.save();

    res.redirect('/dashboard/admin/editors');
  } catch (e) {
    console.error('Error creating editor:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

interface IUpdateEditor {
  editorId: mongoose.Types.ObjectId;
  name?: string;
  dob?: Date | null;
  gender?: 'male' | 'female' | 'other' | null;
  sectionId?: mongoose.Types.ObjectId;
  email?: string;
  username?: string;
  password?: string;
}

export const adminUpdateEditor = async (req: Request<{}, {}, IUpdateEditor>, res: Response) => {
  try {
    const { editorId, name, dob, gender, sectionId, email, username, password } = req.body;

    // Find the editor profile
    const editorProfile = await EditorProfile.findById(editorId);
    if (!editorProfile) {
      res.status(404).json({ status: 'error', message: 'Editor not found' });
      return;
    }

    // Update the editor profile fields if provided
    if (name) editorProfile.name = name;
    if (dob) editorProfile.dob = dob;
    if (gender) editorProfile.gender = gender;
    if (sectionId) editorProfile.sectionId = sectionId;

    await editorProfile.save();

    // Find the associated account
    const accountId = editorProfile.accountId;
    const editorAccount = await Account.findByIdAndUpdate(
      accountId,
      {
        email: email,
        'localAuth.username': username,
        'localAuth.password': password ? bcrypt.hashSync(password, 10) : undefined
      },
      { new: true }
    );

    if (!editorAccount) {
      res.status(404).json({ status: 'error', message: 'Account not found' });
    }

    res.redirect('/dashboard/admin/editors');
  } catch (e) {
    console.error('Error updating editor:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
