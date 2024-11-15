import mongoose, { Schema } from 'mongoose';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
const accountSchema = new Schema<IAccount>({
  username: { type: String, unique: true, sparse: true }, // Chỉ sử dụng cho LocalAccount
  password: { type: String, select: true }, // Chỉ sử dụng cho LocalAccount
  googleId: { type: String, unique: true, sparse: true }, // Chỉ sử dụng cho GoogleAccount
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['reader', 'subscriber', 'reporter', 'editor', 'admin'],
    required: true
  }, // Thay type thành role
  isSubscriber: { type: Boolean, default: false },
  subscriptionExpiresAt: { type: Date },
  profileType: { type: String, required: true }, // Ví dụ: "ReporterProfile", "SubscriberProfile"
  profileId: { type: mongoose.Schema.Types.ObjectId, refPath: 'profileType' }
});

export default mongoose.model<IAccount>('Account', accountSchema);
