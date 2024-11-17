import mongoose, { Schema, Document } from 'mongoose';
import { IComment } from '~/interfaces/Comment/ commentInterface.js';
const commentSchema = new Schema<IComment>(
  {
    article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    content: { type: String, required: true, minlength: 1, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
