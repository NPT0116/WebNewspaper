import mongoose, { Schema, Document } from 'mongoose';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
import { ProfileType, Role, validProfiles } from '~/interfaces/Role - ProfileType/roleProfileEnum.js';

const accountSchema = new Schema<IAccount>({
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['reader', 'subscriber', 'reporter', 'editor', 'admin'],
    required: true
  },
  isSubscriber: { type: Boolean, default: false },
  subscriptionExpiresAt: { type: Date },
  profileType: { type: String }, // Allows dynamic referencing of different profile types
  profileId: { type: mongoose.Schema.Types.ObjectId, refPath: 'profileType' }, // Dynamic reference based on `profileType`
  localAuth: {
    username: { type: String, unique: true, sparse: true },
    password: { type: String, select: true }
  },
  githubAuth: {
    githubId: { type: String, unique: true, sparse: true }
  },
  resetOtp: { type: String }
});
accountSchema.pre('save', function (next) {
  // Lấy role và profileType từ tài khoản
  const role = this.role as Role;
  const profileType = this.profileType as ProfileType;

  // Kiểm tra nếu profileType không hợp lệ với role
  if (profileType !== validProfiles[role]) {
    return next(new Error(`Invalid profileType "${profileType}" for role "${role}". Expected "${validProfiles[role]}".`));
  }

  next();
});

// Middleware cho findOneAndUpdate
accountSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as IAccount;
  const role = update.role as Role;
  const profileType = update.profileType as ProfileType;

  // Nếu role hoặc profileType được cập nhật, kiểm tra tính hợp lệ
  if (role && profileType && profileType !== validProfiles[role]) {
    return next(new Error(`Invalid profileType "${profileType}" for role "${role}". Expected "${validProfiles[role]}".`));
  }

  next();
});

export const Account = mongoose.model<IAccount>('Account', accountSchema);
