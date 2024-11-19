import mongoose from 'mongoose';

export interface ITag extends Document {
  _id: mongoose.Types.ObjectId;
  name: string; // Tag name
  description?: string; // Optional tag description
  createdAt: Date;
  updatedAt: Date;
}
