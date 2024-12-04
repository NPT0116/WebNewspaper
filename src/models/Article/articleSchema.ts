import mongoose, { Schema, Document } from 'mongoose';
import { IArticle } from '~/interfaces/Article/articleInterface.js';
import { generateSlug } from '~/utils/common.js';

const articleSchema = new Schema<IArticle>(
  {
    slug: { type: String, unique: true },
    title: { type: String },
    description: { type: String },
    content: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'ReporterProfile' },
    editor: { type: Schema.Types.ObjectId, ref: 'EditorProfile' },
    images: [{ type: String }], // URLs for article images
    videoUrl: { type: String }, // Optional YouTube link or other video URL
    layout: {
      type: String,
      enum: ['text-left', 'text-right', 'default'],
      default: 'default'
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'published'],
      default: 'draft'
    },
    publishedAt: { type: Date }, // Only filled when the article is published
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section' },
    views: { type: Number },
    bannerTheme: { type: String, enum: ['dark', 'white'], default: 'dark' },
    isSubscribed: { type: Boolean, default: false }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Middleware để tạo slug tự động trước khi lưu
articleSchema.pre('save', async function (next) {
  if (!this.slug) {
    const baseSlug = generateSlug(this.title);
    let uniqueSlug = baseSlug;
    let count = 1;

    // Kiểm tra slug trùng lặp
    while (await mongoose.models.Article.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    this.slug = uniqueSlug;
  }
  next();
});

// Middleware để cập nhật slug khi tiêu đề thay đổi
articleSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as Partial<IArticle>;
  if (update && update.title) {
    const baseSlug = generateSlug(update.title);
    let uniqueSlug = baseSlug;
    let count = 1;

    // Kiểm tra slug trùng lặp
    while (await mongoose.models.Article.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    update.slug = uniqueSlug;
  }
  next();
});

articleSchema.index(
  {
    title: 'text',
    description: 'text',
    content: 'text'
  },
  {
    name: 'SearchIndex', // Optional: Assign a name for the index
    weights: {
      title: 10,
      description: 5,
      content: 1
    }
  }
);

export const Article = mongoose.model<IArticle>('Article', articleSchema);
