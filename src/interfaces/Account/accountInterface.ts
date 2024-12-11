import mongoose from 'mongoose';

export interface IAccount extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  role: 'reader' | 'subscriber' | 'reporter' | 'editor' | 'admin';
  isSubscriber: boolean;
  subscriptionExpiresAt?: Date;
  profileType?: string; // Specifies the type of profile this account is linked to, e.g., "ReporterProfile" or "SubscriberProfile"
  profileId?: mongoose.Types.ObjectId; // Links to the actual profile document
  localAuth?: { username: string; password: string }; // Only for local accounts
  githubAuth?: { facebookId: string }; // Only for github accounts
  resetOtp?: string;
}
