import mongoose, { Schema, Document } from 'mongoose';

export interface IAccountBase extends Document {
  email: string;
  role: 'reader' | 'subscriber' | 'reporter' | 'editor' | 'admin';
  isSubscriber: boolean;
  subscriptionExpiresAt?: Date;
  profileType: string;
  profileId: mongoose.Types.ObjectId;
}

export interface ILocalAccount extends IAccountBase {
  username: string;
  password: string;
}

export interface IGoogleAccoiunt extends IAccountBase {
  googleId: string;
}

export type IAccount = ILocalAccount | IGoogleAccoiunt;
