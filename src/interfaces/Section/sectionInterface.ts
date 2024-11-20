import mongoose from 'mongoose';

export interface ISection extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  parentSection?: mongoose.Types.ObjectId | null; // Reference to parent section
  childSections?: mongoose.Types.ObjectId[]; // References to child sections
  createdAt: Date;
  updatedAt: Date;
}

export interface ISectionBranch {
  id: string;
  slug: string;
  name: string;
  childSections: ISectionBranch[];
}

export type ISectionTree = ISectionBranch[];
