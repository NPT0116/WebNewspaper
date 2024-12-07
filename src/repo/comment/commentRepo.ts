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
import { articleDetailPage } from '~/utils/pages/page.js';
interface saveCommentRequest {
  content: string;
}
interface saveCommentParams {
  articleSlug: string;
  sectionSlug: string;
}
export const saveComment = async (req: Request<saveCommentParams, {}, saveCommentRequest>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { articleSlug, sectionSlug } = req.params;
    const { content } = req.body;

    if (!content || content.trim() == '') {
      res.redirect(`/section/${sectionSlug}/article/${articleSlug}`);
      return;
    }
    const article = await Article.findOne({ slug: articleSlug });
    if (!article) {
      res.redirect(`/section/${sectionSlug}/article/${articleSlug}`);
      return;
    }
    if (!req.user || !req.isAuthenticated()) {
      res.redirect(`/section/${sectionSlug}/article/${articleSlug}`);
      return;
    }

    const readerProfile = await ReaderProfile.findOne({ accountId: req.user._id });
    if (!readerProfile) {
      res.redirect(`/section/${sectionSlug}/article/${articleSlug}`);
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
    article.comments.push(savedComment._id);
    await article.save();
    const io = getIO();
    io.to(articleSlug).emit('newComment', {
      content: savedComment.content,
      account: { name: readerProfile.name },
      createdAt: savedComment.createdAt
    });
    // console.log('Emitting newComment:', {
    //   content: savedComment.content,
    //   account: { name: readerProfile.name },
    //   createdAt: savedComment.createdAt
    // });

    res.status(201).json({
      status: 'success',
      data: {
        content,
        account: { name: readerProfile.name },
        createdAt: newComment.createdAt
      }
    });
  } catch (e) {
    next(new AppError("can't save comment.", 500));
  }
};
