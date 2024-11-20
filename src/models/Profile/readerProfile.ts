import mongoose, { Schema, Document } from 'mongoose';
import { IReaderProfile } from '~/interfaces/Profile/profileBaseInterface.js';

const readerProfileSchema = new Schema<IReaderProfile>({
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: 'Account',
    require: false
  },
  name: { type: String, required: true },
  dob: { type: Date, default: null },
  gender: { type: String, enum: ['male', 'female', 'other'], default: null },
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }]
});

export const ReaderProfile = mongoose.model<IReaderProfile>('ReaderProfile', readerProfileSchema);