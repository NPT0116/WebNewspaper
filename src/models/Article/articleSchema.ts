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
    images: [{ type: String }], // URLs for article images
    videoUrl: { type: String }, // Optional YouTube link or other video URL
    layout: {
      type: Number,
      enum: [1, 2, 3],
      default: 3
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'published'],
      default: 'draft'
    },
    publishedAt: { type: Date, default: undefined },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section' },
    views: { type: Number },
    bannerTheme: { type: String, enum: ['dark', 'white'], default: 'dark' },
    isSubscribed: { type: Boolean, default: false },
    approved: {
      editorId: { type: Schema.Types.ObjectId, ref: 'EditorProfile', default: undefined },
      adminId: { type: Schema.Types.ObjectId, ref: 'AdminProfile', default: undefined },
      publishedAt: { type: Date, default: undefined }
    },
    rejected: {
      editorId: { type: Schema.Types.ObjectId, ref: 'EditorProfile', default: undefined },
      adminId: { type: Schema.Types.ObjectId, ref: 'AdminProfile', default: undefined },
      rejectReason: { type: String }
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

articleSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    const baseSlug = generateSlug(this.title);
    let uniqueSlug = baseSlug;
    let count = 1;

    // Check for duplicate slugs
    while (await mongoose.models.Article.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    this.slug = uniqueSlug;
  }
  next();
});

articleSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as Partial<{ title: string; slug: string }>;

  if (update && update.title) {
    const baseSlug = generateSlug(update.title);
    let uniqueSlug = baseSlug;
    let count = 1;

    // Check for duplicate slugs
    while (await mongoose.models.Article.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    update.slug = uniqueSlug;
    this.setUpdate(update); // Apply the modified update object
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
