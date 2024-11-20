import mongoose, { Document } from 'mongoose';
import { ITag } from '../Tag/tagSchema.js';
import { IComment } from '../Comment/ commentInterface.js';
import { ISection } from '../Section/sectionInterface.js';
export interface IAuthor {
  _id: mongoose.Types.ObjectId;
  name: string;
}
export interface IArticle extends Document {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: IAuthor | mongoose.Types.ObjectId; // Can be either populated or ObjectId
  editor: mongoose.Types.ObjectId; // Refers to editorProfile
  images: string[]; // Array of image URLs
  videoUrl?: string; // Optional video URL (e.g., YouTube link)
  layout: string;
  status: 'draft' | 'approved' | 'rejected' | 'published' | 'pending'; // Article status
  publishedAt?: Date; // Publication date if published
  createdAt: Date;
  updatedAt: Date;
  sectionId: ISection | mongoose.Types.ObjectId;
  tags: (ITag | mongoose.Types.ObjectId)[]; // Array of populated or ObjectId
  comments: IComment[];
  views: number;
  bannerTheme: string;
}

export interface IArticleBasicInfo {
  title: string;
  section: string;
  tags: string[];
  publishedAt?: Date;
  description: string;
  coverImage: string;
}
