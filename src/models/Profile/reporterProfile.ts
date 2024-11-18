import mongoose, { Schema } from 'mongoose';
import { IReporterProfile } from '~/interfaces/Profile/profileBaseInterface.js';
const reporterProfileSchema = new Schema<IReporterProfile>({
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: 'Account',
    require: false
  },
  name: { type: String, required: true },
  dob: { type: Date, default: null },
  gender: { type: String, enum: ['male', 'female', 'other'], default: null },
  reportArticles: [{ type: mongoose.Types.ObjectId, ref: 'Article' }]
});

export const ReporterProfile = mongoose.model<IReporterProfile>('ReporterProfile', reporterProfileSchema);
