import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Section } from '~/models/Section/sectionSchema.js';
import { Tag } from '~/models/Tag/tagSchema.js';
import { deleteArticle } from '~/repo/Article/articleRepo.js';
import { getSectionTree } from '~/repo/Section/index.js';

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
