import mongoose, { Document } from 'mongoose';
import { ITag } from '../Tag/tagSchema.js';
import { IComment } from '../Comment/ commentInterface.js';

export interface IArticle extends Document {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: mongoose.Types.ObjectId; // Refers to reporterProfile
  editor: mongoose.Types.ObjectId; // Refers to editorProfile
  images: string[]; // Array of image URLs
  videoUrl?: string; // Optional video URL (e.g., YouTube link)
  layout: string;
  status: 'draft' | 'approved' | 'rejected' | 'published' | 'pending'; // Article status
  publishedAt?: Date; // Publication date if published
  createdAt: Date;
  updatedAt: Date;
  sectionId: mongoose.Types.ObjectId;
  tags: ITag[];
  comments: IComment[];
}
