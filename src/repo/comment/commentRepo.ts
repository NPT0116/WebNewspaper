import mongoose from 'mongoose';
import { Comment } from '../../models/Comment/commentSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import { IComment, ICommentResponse } from '~/interfaces/Comment/ commentInterface.js';
import { AppError } from '~/utils/appError.js';
import { Section } from '~/models/Section/sectionSchema.js';

export const getCommentsByArticleSlug = async (sectionSlug: string, articleSlug: string): Promise<ICommentResponse[]> => {
  const section = await Section.findOne({ slug: sectionSlug });
  const article = await Article.findOne({ slug: articleSlug });

  if (!section || !article || section._id.toString() !== article.sectionId.toString()) {
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
