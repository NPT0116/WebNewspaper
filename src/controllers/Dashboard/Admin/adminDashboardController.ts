import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
import { Article } from '~/models/Article/articleSchema.js';
import { EditorProfile } from '~/models/Profile/editorProfile.js';
import { ReaderProfile } from '~/models/Profile/readerProfile.js';
import { ReporterProfile } from '~/models/Profile/reporterProfile.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { Tag } from '~/models/Tag/tagSchema.js';
import { deleteArticle } from '~/repo/Article/articleRepo.js';
import { getSectionTree } from '~/repo/Section/index.js';

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
    res.render('layouts/DashboardLayout/DashboardLayout', {
      body: '../../pages/DashboardPages/Admin/EditorsPage',
      data: { editors: data, role: 'admin' }
    });
  } catch (error) {
    console.error('Error retrieving editor profiles:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

export const renderAdminSectionPage = async (req: Request, res: Response) => {
  try {
    const sections = await getSectionTree();
    res.render('layouts/DashboardLayout/DashboardLayout', {
      body: '../../pages/DashboardPages/Admin/SectionsPage',
      data: { sections, role: 'admin' }
    });
  } catch (e) {
    console.error('Error retrieving section profiles:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

export const renderAdminTagsPage = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    res.render('layouts/DashboardLayout/DashboardLayout', {
      body: '../../pages/DashboardPages/Admin/TagsPage',
      data: { tags, role: 'admin' }
    });
  } catch (e) {
    console.error('Error retrieving section profiles:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

export const renderAdminReaderPage = async (req: Request, res: Response) => {
  try {
    const readers = await ReaderProfile.find().populate('accountId');
    const data = readers.map((reader) => ({
      _id: reader._id,
      accountId: reader.accountId,
      name: reader.name,
      dob: reader.dob
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

interface ICreateNewSection {
  name: string;
  parentSectionId: mongoose.Types.ObjectId | null;
}

export const createNewSection = async (req: Request<{}, {}, ICreateNewSection>, res: Response) => {
  try {
    const { name, parentSectionId }: ICreateNewSection = req.body;
    const newSection = new Section({ name, parentSection: parentSectionId });
    await newSection.save();
    res.json({ status: 'success', message: 'New section created successfully' });
  } catch (e) {
    console.error('Error creating new section:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

interface IUpdateSection {
  _id: mongoose.Types.ObjectId;
  name: string;
  parentSectionId: mongoose.Types.ObjectId | null;
}

export const updateSection = async (req: Request<{}, {}, IUpdateSection>, res: Response) => {
  try {
    const { _id, name, parentSectionId }: IUpdateSection = req.body;
    await Section.findOneAndUpdate({ _id }, { name, parentSection: parentSectionId });
    res.json({ status: 'success', message: 'Section updated successfully' });
  } catch (e) {
    console.error('Error updating section:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

interface ICreateNewTag {
  name: string;
  description: string;
}

export const createNewTag = async (req: Request<{}, {}, ICreateNewTag>, res: Response) => {
  try {
    const { name, description }: ICreateNewTag = req.body;
    const newTag = new Tag({ name, description });
    await newTag.save();
    res.json({ status: 'success', message: 'New tag created successfully' });
  } catch (e) {
    console.error('Error creating new tag:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

interface IUpdateTag {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
}

export const updateTag = async (req: Request<{}, {}, IUpdateTag>, res: Response) => {
  try {
    const { _id, name, description }: IUpdateTag = req.body;
    await Tag.findOneAndUpdate({ _id }, { name, description });
    res.json({ status: 'success', message: 'Tag updated successfully' });
  } catch (e) {
    console.error('Error updating tag:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
