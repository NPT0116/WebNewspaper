import mongoose from 'mongoose';

export interface ISection extends Document {
  name: string;
  parentSection?: mongoose.Types.ObjectId | null; // Reference to parent section
  childSections?: mongoose.Types.ObjectId[]; // References to child sections
  createdAt: Date;
  updatedAt: Date;
}
