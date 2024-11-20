import mongoose, { Schema, Document } from 'mongoose';
import { ISection } from '../../interfaces/Section/sectionInterface.js';
import { generateSlug } from '~/utils/common.js';

const sectionSchema = new Schema<ISection>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    parentSection: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', default: null },
    childSections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }]
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Middleware để tạo slug tự động trước khi lưu
sectionSchema.pre('save', async function (next) {
  if (!this.slug) {
    const baseSlug = generateSlug(this.name);
    let uniqueSlug = baseSlug;
    let count = 1;

    // Kiểm tra slug trùng lặp
    while (await mongoose.models.Section.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    this.slug = uniqueSlug;
  }
  next();
});

// Middleware để cập nhật slug khi tên section thay đổi
sectionSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as Partial<ISection>;
  if (update && update.name) {
    const baseSlug = generateSlug(update.name);
    let uniqueSlug = baseSlug;
    let count = 1;

    // Kiểm tra slug trùng lặp
    while (await mongoose.models.Section.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    update.slug = uniqueSlug;
  }
  next();
});

export const Section = mongoose.model<ISection>('Section', sectionSchema);
