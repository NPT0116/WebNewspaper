import mongoose from 'mongoose';
import { Comment } from '../../models/Comment/commentSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import { IComment, ICommentResponse } from '~/interfaces/Comment/ commentInterface.js';
import { AppError } from '~/utils/appError.js';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
import { Account } from '~/models/Account/accountSchema.js';

export const getCommentsByArticleSlug = async (articleSlug: string): Promise<ICommentResponse[]> => {
  const article = await Article.findOne({ slug: articleSlug });

  if (!article) {
    throw new AppError('Article not found', 404, []);
  }

  const comments: IComment[] = await Comment.find({ article: article._id })
    .populate({
      path: 'account',
      populate: {
        path: 'profileId',
        select: 'name'
      }
    })
    .select('content createdAt');

  const formattedComments: ICommentResponse[] = comments.map((comment) => {
    const account = comment.account as any;
    const profile = account?.profileId as any;

    return {
      commenterName: profile?.name || 'Unknown',
      content: comment.content,
      createdAt: comment.createdAt
    };
  });

  return formattedComments;
};
