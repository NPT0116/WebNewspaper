import mongoose, { Schema, Document } from 'mongoose';
import { ITag } from '~/interfaces/Tag/tagSchema.js';
import { generateSlug } from '~/utils/common.js';

const tagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    description: { type: String, default: '' }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Middleware để tạo slug tự động trước khi lưu
tagSchema.pre('save', async function (next) {
  if (!this.slug) {
    const baseSlug = generateSlug(this.name);
    let uniqueSlug = baseSlug;
    let count = 1;

    // Kiểm tra slug trùng lặp
    while (await mongoose.models.Tag.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    this.slug = uniqueSlug;
  }
  next();
});

// Middleware để cập nhật slug khi tên tag thay đổi
tagSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as Partial<ITag>;
  if (update && update.name) {
    const baseSlug = generateSlug(update.name);
    let uniqueSlug = baseSlug;
    let count = 1;

    // Kiểm tra slug trùng lặp
    while (await mongoose.models.Tag.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    update.slug = uniqueSlug;
  }
  next();
});

export const Tag = mongoose.model<ITag>('Tag', tagSchema);
