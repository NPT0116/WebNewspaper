import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
import { Article } from '~/models/Article/articleSchema.js';
import { EditorProfile } from '~/models/Profile/editorProfile.js';
import { ReaderProfile } from '~/models/Profile/readerProfile.js';
import { ReporterProfile } from '~/models/Profile/reporterProfile.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { Tag } from '~/models/Tag/tagSchema.js';
import { getSectionTree } from '~/repo/Section/index.js';

interface IAuthor {
  _id: mongoose.Types.ObjectId;
  name: string;
}

interface IDashboardArticle {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  author: IAuthor;
  images: string[];
  videoUrl?: string;
  publishedAt?: Date;
  layout: 'text-left' | 'text-right' | 'default';
  status: 'draft' | 'approved' | 'rejected' | 'published' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  sectionId: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  views: number;
  isSubscribed: boolean;
  approved: {
    editorId?: mongoose.Types.ObjectId;
    publishedAt?: Date;
  };
  rejected: {
    editorId?: mongoose.Types.ObjectId;
    rejectReason?: string;
  };
}

export const renderAdminArticlePage = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find({})
      .populate({
        path: 'rejected.editorId',
        select: 'name',
        model: 'EditorProfile'
      })
      .populate({
        path: 'approved.editorId',
        select: 'name',
        model: 'EditorProfile'
      })
      .populate({
        path: 'sectionId',
        select: 'name'
      })
      .populate<{ author: IAuthor }>('author', 'name');

    const data: IDashboardArticle[] = articles.map((article) => {
      return {
        _id: article._id,
        title: article.title,
        description: article.description,
        author: article.author as IAuthor,
        images: article.images,
        videoUrl: article.videoUrl,
        publishedAt: article.publishedAt,
        layout: article.layout,
        status: article.status,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        sectionId: article.sectionId,
        tags: article.tags,
        views: article.views ?? 0,
        isSubscribed: article.isSubscribed,
        approved: {
          editorId: article.approved?.editorId,
          publishedAt: article.approved?.publishedAt
        },
        rejected: {
          editorId: article.rejected?.editorId,
          rejectReason: article.rejected?.rejectReason
        }
      };
    });

    res.render('layouts/DashboardLayout/DashboardLayout', {
      body: '../../pages/DashboardPages/Admin/AdminArticlesPage',
      data: { articles: data, role: 'admin' }
    });
    // res.json({ data });
  } catch (e) {
    console.error('Error retrieving reporter profiles:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

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
    res.json({ data });
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
    res.json({ data });
  } catch (error) {
    console.error('Error retrieving editor profiles:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

export const renderAdminSectionPage = async (req: Request, res: Response) => {
  try {
    const sections = await getSectionTree();
    res.json({ data: sections });
  } catch (e) {
    console.error('Error retrieving section profiles:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

export const renderAdminTagsPage = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    res.json({ data: tags });
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
    res.json({ data });
  } catch (e) {
    console.error('Error retrieving section profiles:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
