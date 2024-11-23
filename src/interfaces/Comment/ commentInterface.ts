import mongoose, { Document } from 'mongoose';

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  article: mongoose.Types.ObjectId; // Refers to the Article being commented on
  account: mongoose.Types.ObjectId; // Refers to the Account of the commenter
  content: string; // Content of the comment
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentResponse {
  commenterName: string;
  content: string;
  createdAt: Date;
}
