import { Tag } from '~/models/Tag/tagSchema.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Article } from '~/models/Article/articleSchema.js';
interface IAdminTagsDashboard {
  deleteActivate: boolean;
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string; // Tag name
  description?: string; // Optional tag description
  createdAt: Date;
  updatedAt: Date;
}

export const renderAdminTagsPage = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    const data: IAdminTagsDashboard[] = await Promise.all(
      tags.map(async (tag) => {
        const articleUsingTag = await Article.findOne({ tags: { $in: [tag._id] } });
        return {
          _id: tag._id,
          slug: tag.slug,
          name: tag.name,
          description: tag.description,
          createdAt: tag.createdAt,
          updatedAt: tag.updatedAt,
          deleteActivate: articleUsingTag ? false : true
        };
      })
    );
    res.render('layouts/DashboardLayout/DashboardLayout', {
      body: '../../pages/DashboardPages/Admin/TagsPage',
      data: { tags: data, role: 'admin' }
    });
  } catch (e) {
    console.error('Error retrieving section profiles:', e);
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
    const tag = await Tag.findOne({ name });
    if (tag) {
      return res.redirect('/dashboard/admin/tags');
    }
    const newTag = new Tag({ name, description });
    await newTag.save();
    res.redirect('/dashboard/admin/tags');
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
    res.redirect('/dashboard/admin/tags');
  } catch (e) {
    console.error('Error updating tag:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

interface IDeleteTag {
  tagId: mongoose.Types.ObjectId;
}
export const deleteTag = async (req: Request<IDeleteTag, {}, {}>, res: Response) => {
  try {
    const { tagId } = req.params;
    await Tag.findOneAndDelete({ _id: tagId });
    res.redirect('/dashboard/admin/tags');
  } catch (e) {
    console.error('Error deleting tag:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
