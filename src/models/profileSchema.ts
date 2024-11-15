import mongoose, { Schema, Document } from 'mongoose';
import { IAccount } from '../interfaces/Account/accountInterface.js';

export interface IProfile extends Document {
  accountId?: mongoose.Types.ObjectId | IAccount;
  name: string;
  dob: Date | null;
  gender: 'male' | 'female' | 'other' | null;
}

const profileSchema = new Schema<IProfile>({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: false
  }, // Tham chiếu tới Account
  name: { type: String, required: true },
  dob: { type: Date, default: null },
  gender: { type: String, enum: ['male', 'female', 'other'], default: null }
});

export default mongoose.model<IProfile>('Profile', profileSchema);
