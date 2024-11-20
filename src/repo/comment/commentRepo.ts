import mongoose, { Mongoose } from 'mongoose';
import { Comment } from '../../models/Comment/commentSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import { IComment, ICommentResponse } from '~/interfaces/Comment/ commentInterface.js';
import { AppError } from '~/utils/appError.js';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
import { Account } from '~/models/Account/accountSchema.js';
import { NextFunction, Request, Response } from 'express';
import { ReaderProfile } from '~/models/Profile/readerProfile.js';
import { getIO } from '~/config/socket.js';
import { Section } from '~/models/Section/sectionSchema.js';

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

interface saveCommentRequest {
  content: string;
}
interface saveCommentParams {
  articleSlug: string;
}

export const saveComment = async (req: Request<saveCommentParams, {}, saveCommentRequest>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { articleSlug } = req.params;
    const { content } = req.body;

    if (!content || content.trim() == '') {
      next(new AppError("content can't be blanked", 404));
      return;
    }
    const article = await Article.findOne({ slug: articleSlug });
    if (!article) {
      next(new AppError('Article not found', 404));
      return;
    }
    if (!req.user || !req.isAuthenticated()) {
      next(new AppError('User not authorize or not found', 401));
      return;
    }

    const readerProfile = await ReaderProfile.findOne({ accountId: req.user._id });
    if (!readerProfile) {
      next(new AppError('Reader profile not found for this user', 404));
      return;
    }
    const newComment = new Comment({
      article: article._id,
      account: req.user._id, // Using the user ID from req.user
      content: content,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const savedComment = await newComment.save();
    const io = getIO();
    io.to(articleSlug).emit('newComment', {
      content,
      account: { name: readerProfile.name }, // Hiển thị tên người dùng
      createdAt: newComment.createdAt
    });
    res.status(201).json({
      status: 'success',
      data: savedComment
    });
  } catch (e) {
    next(new AppError("can't save comment.", 500));
  }
};
