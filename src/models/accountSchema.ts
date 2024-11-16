import mongoose, { Schema, Document } from 'mongoose';
import { IAccount } from '~/interfaces/Account/accountInterface.js';

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
  }
});

export default mongoose.model<IAccount>('Account', accountSchema);
