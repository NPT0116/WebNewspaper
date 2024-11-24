import mongoose from 'mongoose';

export interface IWatchedArticle {
  articleId: mongoose.Types.ObjectId;
  viewedAt: Date;
}
