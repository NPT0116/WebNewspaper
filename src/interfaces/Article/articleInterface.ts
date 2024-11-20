import mongoose, { Document } from 'mongoose';
export interface IAuthor {
  _id: mongoose.Types.ObjectId;
  name: string;
}

export interface ITag {
  _id: mongoose.Types.ObjectId;
  name: string;
}

export interface ISection {
  _id: mongoose.Types.ObjectId;
  name: string;
}

export interface IComment {
  _id: mongoose.Types.ObjectId;
  content: string;
}

// Unpopulated IArticle (default)
export interface IArticle extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: mongoose.Types.ObjectId;
  editor: mongoose.Types.ObjectId;
  images: string[];
  videoUrl?: string;
  layout: 'text-left' | 'text-right' | 'default';
  status: 'draft' | 'approved' | 'rejected' | 'published' | 'pending';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  sectionId: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  views: number;
  bannerTheme: string;
}

// Populated IArticle
export interface IArticlePopulated extends Omit<IArticle, 'author' | 'sectionId' | 'tags' | 'comments'> {
  author: IAuthor;
  sectionId: ISection;
  tags: ITag[];
  comments: IComment[];
}
