import mongoose, { Schema } from 'mongoose';
import { IAdminProfile } from '~/interfaces/Profile/profileBaseInterface.js';
const adminProfileSchema = new Schema<IAdminProfile>({
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: 'Account',
    require: false
  },
  name: { type: String, required: true },
  dob: { type: Date, default: null },
  gender: { type: String, enum: ['male', 'female', 'other'], default: null }
});

export const AdminProfile = mongoose.model<IAdminProfile>('AdminProfile', adminProfileSchema);
