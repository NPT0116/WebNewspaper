import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Article } from '~/models/Article/articleSchema.js';
import { EditorProfile } from '~/models/Profile/editorProfile.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { getSectionTree } from '~/repo/Section/index.js';

interface IAdminSectionsDashboard {
  deleteActivate: boolean;
  _id: mongoose.Types.ObjectId;
  name: string; // Section name
  createdAt: Date;
  updatedAt: Date;
}

export const renderAdminSectionsPage = async (req: Request, res: Response) => {
  try {
    const sections = await Section.find();
    const data: IAdminSectionsDashboard[] = await Promise.all(
      sections.map(async (section) => {
        const articleUsingSection = await Article.findOne({ sectionId: section._id });
        const editorUsingSection = await EditorProfile.findOne({ sectionId: section._id });
        return {
          _id: section._id,
          name: section.name,
          createdAt: section.createdAt,
          updatedAt: section.updatedAt,
          deleteActivate: articleUsingSection || editorUsingSection ? false : true,
          parentSectionId: section.parentSection
        };
      })
    );
    console.log(data);
    res.render('layouts/DashboardLayout/DashboardLayout', {
      body: '../../pages/DashboardPages/Admin/SectionsPage',
      data: { sections: data, role: 'admin' }
    });
  } catch (e) {
    console.error('Error retrieving sections:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

interface ICreateNewSection {
  name: string;
  parentSectionId: mongoose.Types.ObjectId | null | '';
}

export const createNewSection = async (req: Request<{}, {}, ICreateNewSection>, res: Response) => {
  try {
    const { name, parentSectionId } = req.body;
    const newSection = new Section({ name, parentSection: parentSectionId !== '' ? parentSectionId : null });
    await newSection.save();
    if (parentSectionId) {
      const parent = await Section.findById(parentSectionId);
      if (!parent) {
        res.status(404).json({ status: 'error', message: 'Parent section not found' });
        return;
      }
      if (parent.childSections) {
        parent.childSections.push(newSection._id);
      } else {
        parent.childSections = [newSection._id];
      }
      await parent.save();
    }
    res.redirect('/dashboard/admin/sections');
  } catch (e) {
    console.error('Error creating new section:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
interface IUpdateSection {
  _id: mongoose.Types.ObjectId;
  name: string;
  parentSectionId: mongoose.Types.ObjectId | null | '';
}
export const updateSection = async (req: Request<{}, {}, IUpdateSection>, res: Response) => {
  try {
    const { _id, name, parentSectionId }: IUpdateSection = req.body;
    const oldParentSection = await Section.findOne({ childSections: { $elemMatch: { $eq: _id } } });
    if (oldParentSection) {
      if (oldParentSection.childSections) {
        oldParentSection.childSections = oldParentSection.childSections.filter((id) => id.toString() !== _id.toString());
      }
      await oldParentSection.save();
    }
    await Section.findOneAndUpdate({ _id }, { name, parentSection: parentSectionId !== '' ? parentSectionId : null });
    const parent = await Section.findById(parentSectionId);
    if (parent) {
      if (parent.childSections) {
        parent.childSections.push(_id);
      } else {
        parent.childSections = [_id];
      }
      await parent.save();
    }
    res.redirect('/dashboard/admin/sections');
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

interface IDeleteSection {
  sectionId: mongoose.Types.ObjectId;
}
export const deleteSection = async (req: Request<IDeleteSection, {}, {}>, res: Response) => {
  try {
    const { sectionId }: IDeleteSection = req.params;
    const section = await Section.findByIdAndDelete(sectionId);
    if (!section) {
      res.status(404).json({ status: 'error', message: 'Section not found' });
      return;
    }
    res.redirect('/dashboard/admin/sections');
  } catch (e) {
    console.error('Error deleting section:', e);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
