import { Article } from '~/models/Article/articleSchema.js';
import mongoose from 'mongoose';
import { Section } from '~/models/Section/sectionSchema.js';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '~/utils/appError.js';
import { reporterGetArticleById } from '~/repo/Article/articleRepo.js';
import { ObjectId } from 'mongoose';
import { getArticleByIdParams } from '~/interfaces/Article/articleInterface.js';

interface ArticleQuery {
  search_value: string;
  pageNumber: string;
  pageSize: string;
  sectionId: string;
  tagId: string;
  authorId: string;
}

interface GetArticleByStatusQuery {
  status: string;
  pageNumber: string;
  pageSize: string;
}

export const articleQuery = async (req: Request<{}, {}, {}, ArticleQuery>, res: Response): Promise<void> => {
  try {
    const { search_value, pageNumber, pageSize, sectionId, tagId, authorId } = req.query;

    let query: any = { status: 'published' };

    if (search_value) {
      query = {
        ...query,
        $or: [{ title: { $regex: search_value, $options: 'i' } }, { content: { $regex: search_value, $options: 'i' } }, { description: { $regex: search_value, $options: 'i' } }]
      };
    }
    if (sectionId) {
      query.sectionId = sectionId;
    }
    if (tagId) {
      query.tags = tagId;
    }
    if (authorId) {
      query.author = authorId;
    }

    const pageNum = pageNumber ? parseInt(pageNumber as string, 10) : 1;
    const size = pageSize ? parseInt(pageSize as string, 10) : 10;

    if (isNaN(pageNum) || isNaN(size) || pageNum <= 0 || size <= 0) {
      res.status(400).json({ error: 'Invalid pagination parameters' });
      return;
    }

    const skip = (pageNum - 1) * size;

    // Lấy danh sách articles
    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(size)
      .select('title sectionId tags publishedAt description images slug')
      .populate('author', 'name')
      .populate('tags', 'name')
      .populate('sectionId', 'name');

    const totalArticles = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / size);

    if (skip >= totalArticles && skip !== 0) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    res.json({
      data: articles,
      pagination: {
        totalItems: totalArticles,
        totalPages: totalPages,
        currentPage: pageNum,
        pageSize: size
      }
    });
  } catch (err) {
    console.error('Error in article query and pagination:', err);
    res.status(500).json({ error: `Error querying articles: ${err}` });
  }
};

export const getArticleByStatus = async (req: Request<{}, {}, {}, GetArticleByStatusQuery>, res: Response): Promise<void> => {
  try {
    // Kiểm tra nếu có tham số tìm kiếm (search_value)
    const { status = 'published', pageNumber, pageSize } = req.query;
    const query: any = {};
    query.status = status;
    // Kiểm tra nếu có tham số phân trang
    const pageNum = pageNumber ? parseInt(pageNumber as string, 10) : 1;
    const size = pageSize ? parseInt(pageSize as string, 10) : 10;

    if (isNaN(pageNum) || isNaN(size) || pageNum <= 0 || size <= 0) {
      res.status(400).json({ error: 'Invalid pagination parameters' });
      return;
    }

    const skip = (pageNum - 1) * size;

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(size)
      .select('title sectionId tags publishedAt description images slug')
      .populate('author', 'name')
      .populate('tags', 'name')
      .populate('sectionId', 'name');
    const totalArticles = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / size);

    if (skip >= totalArticles && skip !== 0) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    res.json({
      data: articles,
      pagination: {
        totalItems: totalArticles,
        totalPages: totalPages,
        currentPage: pageNum,
        pageSize: size
      }
    });
  } catch (err) {
    res.status(500).json({ error: `Error querying articles: ${err}` });
  }
};

//Tìm kiếm bài viết theo sectionId
export const getArticlesBySectionId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pageNumber = 1, pageSize = 10 } = req.query;

    const sectionIdMatch = req.originalUrl.match(/\/api\/sections\/([a-fA-F0-9]{24})/);

    if (!sectionIdMatch || !sectionIdMatch[1]) {
      res.status(400).json({ message: 'sectionId is required in the URL' });
      return;
    }

    const sectionId = sectionIdMatch[1];

    if (!mongoose.isValidObjectId(sectionId)) {
      res.status(400).json({ message: 'Invalid sectionId' });
      return;
    }

    const rootSection = await Section.findById(sectionId).populate({
      path: 'childSections',
      populate: {
        path: 'childSections',
        populate: {
          path: 'childSections'
        }
      }
    });

    if (!rootSection) {
      res.status(404).json({ message: 'Section not found' });
      return;
    }

    const collectSectionIds = (section: any): string[] => {
      const childIds = section.childSections?.map(collectSectionIds) || [];
      return [section._id.toString(), ...childIds.flat()];
    };
    const sectionIds = collectSectionIds(rootSection);
    const query = { sectionId: { $in: sectionIds } };

    const pageNum = parseInt(pageNumber as string, 10);
    const size = parseInt(pageSize as string, 10);

    if (isNaN(pageNum) || isNaN(size) || pageNum <= 0 || size <= 0) {
      res.status(400).json({ error: 'Invalid pagination parameters' });
      return;
    }

    const skip = (pageNum - 1) * size;

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(size)
      .select('title sectionId tags publishedAt description images slug')
      .populate('author', 'name')
      .populate('tags', 'name')
      .populate('sectionId', 'name');
    const totalArticles = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / size);
    if (skip >= totalArticles && skip !== 0) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    res.json({
      data: articles,
      pagination: {
        totalItems: totalArticles,
        totalPages: totalPages,
        currentPage: pageNum,
        pageSize: size
      }
    });
  } catch (err) {
    console.error('Error fetching articles by section:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const reporterGetArticleByIdQuery = async (req: Request<getArticleByIdParams>, res: Response, next: NextFunction) => {
  try {
    const user = req.user as unknown as { profileId: ObjectId };
    const reporterProfileId = user.profileId;
    if (!reporterProfileId) {
      return next(new AppError('Profile not found', 400));
    }

    const { articleId } = req.params;
    const article = await reporterGetArticleById(articleId, reporterProfileId.toString());

    res.status(200).json(article);
  } catch (err) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : 'Error fetching article';

    // If the error has a status code, use it, else default to 500
    next(new AppError(message, statusCode));
  }
};
