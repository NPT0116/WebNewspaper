import mongoose, { Document } from 'mongoose';
import { IAccount } from '../Account/accountInterface.js';
import { IComment } from '../Comment/ commentInterface.js';
import { IArticle } from '../Article/articleInterface.js';
import { ISection } from '../Section/sectionInterface.js';
export interface IProfileBase extends Document {
  accountId?: mongoose.Types.ObjectId | IAccount;
  name: string;
  dob: Date | null;
  gender: 'male' | 'female' | 'other' | null;
}

export interface IReaderProfile extends IProfileBase {
  comments: mongoose.Types.ObjectId[];
}
export interface IReporterProfile extends IProfileBase {
  reportArticles: mongoose.Types.ObjectId[];
}
export interface IEditorProfile extends IProfileBase {
  sectionId: mongoose.Types.ObjectId;
  editArticles: mongoose.Types.ObjectId[];
}
export interface IAdminProfile extends IProfileBase {}