import mongoose, { Schema, Document } from 'mongoose';
import { ISection } from '../../interfaces/Section/sectionInterface.js';

const sectionSchema = new Schema<ISection>(
  {
    name: { type: String, required: true },
    parentSection: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', default: null },
    childSections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }]
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

export const Section = mongoose.model<ISection>('Section', sectionSchema);
