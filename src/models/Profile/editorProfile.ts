import mongoose, { Schema } from 'mongoose';
import { IEditorProfile } from '~/interfaces/Profile/profileBaseInterface.js';
const edtiorProfileSchema = new Schema<IEditorProfile>({
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: 'Account',
    require: false
  },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', default: null }, // Sửa tại đây
  name: { type: String, required: true },
  dob: { type: Date, default: null },
  gender: { type: String, enum: ['male', 'female', 'other'], default: null },
  editArticles: [{ type: mongoose.Types.ObjectId, ref: 'Article' }]
});

export const EditorProfile = mongoose.model<IEditorProfile>('EditorProfile', edtiorProfileSchema);
