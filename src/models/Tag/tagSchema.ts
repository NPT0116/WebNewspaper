import mongoose, { Schema, Document } from 'mongoose';
import { ITag } from '~/interfaces/Tag/tagSchema.js';

const tagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

export const Tag = mongoose.model<ITag>('Tag', tagSchema);
